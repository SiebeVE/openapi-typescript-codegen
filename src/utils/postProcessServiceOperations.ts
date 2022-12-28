import type { Operation } from '../client/interfaces/Operation';
import type { Service } from '../client/interfaces/Service';
import { RequestHeaders, ResponseTypeSuffix } from '../RequestHeaders';
import { flatMap } from './flatMap';

export const getCorrectAcceptType = (oldType: string, accept: RequestHeaders) => {
    const typeParts = oldType.split('_');
    const suffix = ResponseTypeSuffix[accept];
    if (typeParts.length >= 2 && typeParts[1] === suffix) {
        return oldType;
    }
    typeParts.splice(1, 0, suffix);
    return typeParts.filter(part => part !== '').join('_');
};

export const postProcessServiceOperations = (service: Service, accept: RequestHeaders): Operation[] => {
    const names = new Map<string, number>();

    return service.operations.map(operation => {
        const clone = { ...operation };

        clone.imports = clone.imports.map(importType => getCorrectAcceptType(importType, accept));
        clone.results = clone.results.map(result => {
            result.base = getCorrectAcceptType(result.base, accept);
            result.type = getCorrectAcceptType(result.type, accept);
            result.imports = result.imports.map(importType => getCorrectAcceptType(importType, accept));

            return result;
        });

        const currentParameters: Record<string, string> = {};
        const toRemove: Record<string, string> = {};
        for (const { name, export: exportType } of clone.parameters) {
            if (currentParameters.hasOwnProperty(name)) {
                if (currentParameters[name] === 'array') {
                    toRemove[name] = exportType;
                } else {
                    toRemove[name] = currentParameters[name];
                }
                continue;
            }
            currentParameters[name] = exportType;
        }
        clone.parameters = clone.parameters.filter(({ name, export: exportType }) => {
            return !(toRemove.hasOwnProperty(name) && exportType === toRemove[name]);
        });
        clone.parametersQuery = clone.parametersQuery.filter(({ name, export: exportType }) => {
            return !(toRemove.hasOwnProperty(name) && exportType === toRemove[name]);
        });

        // Parse the service parameters and results, very similar to how we parse
        // properties of models. These methods will extend the type if needed.
        clone.imports.push(...flatMap(clone.parameters, parameter => parameter.imports));
        clone.imports.push(...flatMap(clone.results, result => result.imports));

        // Check if the operation name is unique, if not then prefix this with a number
        const name = clone.name;
        const index = names.get(name) || 0;
        if (index > 0) {
            clone.name = `${name}${index}`;
        }
        names.set(name, index + 1);

        return clone;
    });
};
