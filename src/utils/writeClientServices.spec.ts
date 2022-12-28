import { EOL } from 'os';

import type { Service } from '../client/interfaces/Service';
import { HttpClient } from '../HttpClient';
import { Indent } from '../Indent';
import { RequestHeaders } from '../RequestHeaders';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientServices } from './writeClientServices';

jest.mock('./fileSystem');

describe('writeClientServices', () => {
    it('should write to filesystem', async () => {
        const services: Service[] = [
            {
                name: 'User',
                operations: [],
                imports: [],
            },
        ];

        const templates: Templates = {
            index: () => 'index',
            client: () => 'client',
            exports: {
                model: () => 'model',
                schema: () => 'schema',
                service: () => 'service',
            },
            core: {
                settings: () => 'settings',
                apiError: () => 'apiError',
                apiRequestOptions: () => 'apiRequestOptions',
                apiResult: () => 'apiResult',
                cancelablePromise: () => 'cancelablePromise',
                request: () => 'request',
                baseHttpRequest: () => 'baseHttpRequest',
                httpRequest: () => 'httpRequest',
                accept: {
                    [RequestHeaders.HAL]: () => 'jsonHal',
                    [RequestHeaders.LD]: () => 'jsonLd',
                },
            },
        };

        await writeClientServices(
            services,
            templates,
            '/',
            HttpClient.FETCH,
            RequestHeaders.JSON,
            false,
            false,
            Indent.SPACE_4,
            'Service'
        );

        expect(writeFile).toBeCalledWith('/UserService.ts', `service${EOL}`);
    });
});
