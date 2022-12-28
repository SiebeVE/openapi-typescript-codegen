import type { Client } from '../client/interfaces/Client';
import { RequestHeaders } from '../RequestHeaders';
import { postProcessModel } from './postProcessModel';
import { postProcessService } from './postProcessService';

/**
 * Post process client
 * @param client Client object with all the models, services, etc.
 */
export const postProcessClient = (client: Client, accept: RequestHeaders): Client => {
    return {
        ...client,
        models: client.models.map(model => postProcessModel(model)),
        services: client.services.map(service => postProcessService(service, accept)),
    };
};
