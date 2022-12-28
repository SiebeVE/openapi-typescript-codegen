export enum RequestHeaders {
    JSON = 'application/json',
    LD = 'application/ld+json',
    HAL = 'application/hal+json',
}

export const ResponseTypeFileName = {
    [RequestHeaders.LD]: 'JsonLd',
    [RequestHeaders.HAL]: 'JsonHal',
};

export const ResponseTypeSuffix = {
    [RequestHeaders.JSON]: '',
    [RequestHeaders.LD]: 'jsonld',
    [RequestHeaders.HAL]: 'jsonhal',
};
