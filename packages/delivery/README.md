# Angular Universal Friendly Kentico Cloud Delivery SDK

Fork of the [Official Kentico Cloud SDK](https://github.com/Enngage/kentico-cloud-js/tree/master/packages/delivery).

This has a very specific purpose which is to provide a means bypass the in-build http client (axios) in-order to use Angular's in built http client. This is an important when using Angular Universal. If you don't need to bypass the default client, use the [Official SDK](https://github.com/Enngage/kentico-cloud-js/tree/master/packages/delivery).

Angular Universal requires all http requests to be performed using it's inbuilt HTTP client. This official SDK will work, however the server side will render before Observable or Promise has resolved. After extensive attempts work arounds this was the only solution which I found.

Related GitHub issue - [https://github.com/angular/universal/issues/842](https://github.com/angular/universal/issues/842)


Things to be aware of;

 * Built in SDK re-try logic is bypassed, it's up to you to implement this yourself as part of your http client implementation.
 * Axios dependencies still exist to keep default logic working, the goal of this fork was to make non breaking changes to the origin project. This will add unessesary payload to the browser build.
 * This is not currently covered by testing, this is a proof of concept.

## Install
`npm install banjo-kentico-cloud-delivery`

## Usage example
```
// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeliveryClient, ItemResponses } from 'banjo-kentico-cloud-delivery';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

    private client: DeliveryClient;

    constructor(private http: HttpClient) {
        this.client = new DeliveryClient({
            projectId: 'xxxxxxx'
        });
    }

    /**
    * Single Item Query
    */
    getNewsArticle(urlSlug: string): Observable<ItemResponses.DeliveryItemResponse<NewsArticle>> {
        // create query as per official SDK
        const query = this.client.items<NewsArticle>()
        .type('news_article')
        .equalsFilter('elements.url_slug', urlSlug)
        .limitParameter(1)
        .depthParameter(3);

        // get kentico request URL from query builder
        const url = query.getUrl();

        // perform Angular HTTP GET request
        return this.http.get(url).pipe(
            map((response: any, index: number) => {
                // Pass raw response body into our custom method
                return query.injectSingleItem(response);
            })
        );
    }

    /**
    * Multiple Item Query
    */
    getNewsArticles(): Observable<ItemResponses.DeliveryItemListingResponse<NewsArticle>> {
        // create query as per official SDK
        const query = this.client.items<NewsArticle>()
        .type('news_article')
        .depthParameter(3);

        // get kentico request URL from query builder
        const url = query.getUrl();

        return this.http.get(url).pipe(
            map((response: any, index: number) => {
            		// Pass raw response body into our custom method
                return query.injectMultipleItems(response);
            })
        );
    }
}
```