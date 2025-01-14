const assert = require('assert');
const KontentDelivery = require('../../_commonjs');

const deliveryClient = new KontentDelivery.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
    typeResolvers: []
});

const contentTypeHeaderName = 'Content-Type';
const sdkVersionHeaderName = 'X-KC-SDKID';

describe('#Headers', () => {

    let result;

    before((done) => {
        deliveryClient.items()
            .equalsFilter('system.type', 'article')
            .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
            .orderParameter('elements.post_date', KontentDelivery.SortOrder.desc)
            .limitParameter(3)
            .toObservable()
            .subscribe(response => {
                result = response;
                done();
            });
    });

    it('Request headers should contain ' + sdkVersionHeaderName, () => {
        const requestHeaders = result.debug.response.config.headers;

        assert.ok(requestHeaders);
        const sdkVersionHeader = requestHeaders[sdkVersionHeaderName];
        assert.ok(sdkVersionHeader);
    });

    it('Request headers should not contain ' + contentTypeHeaderName, () => {
        const requestHeaders = result.debug.response.config.headers;

        assert.ok(requestHeaders);
        const contentTypeHeader = requestHeaders[contentTypeHeaderName];
        assert.equal(contentTypeHeader, undefined);
    });
    
});


