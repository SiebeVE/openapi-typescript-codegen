import type { Service } from '../client/interfaces/Service';
import { RequestHeaders } from '../RequestHeaders';
import { postProcessServiceImports } from './postProcessServiceImports';
import { getCorrectAcceptType, postProcessServiceOperations } from './postProcessServiceOperations';

export const postProcessService = (service: Service, accept: RequestHeaders): Service => {
    const clone = { ...service };
    clone.imports = clone.imports.map(importType => getCorrectAcceptType(importType, accept));
    clone.operations = postProcessServiceOperations(clone, accept);
    clone.operations.forEach(operation => {
        clone.imports.push(...operation.imports);
    });
    clone.imports = postProcessServiceImports(clone);
    return clone;
};
