import { DeliveryHttpService } from '../lib';

describe('Developer testing', () => {

    const httpService = new DeliveryHttpService();

    beforeAll((done) => {
        httpService.get('https://deliver.kenticocloud.com/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items/warrior', [])
            .subscribe((response) => {
                console.log(response);
                done();
            });
    });

    it(`Test`, () => {
        expect(true).toBeDefined();
    });

});

