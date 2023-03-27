import type { 
    AvailableUris, 
    ContentTypeFromUri,
    InterpretedRequestType,
    FetchReturnTypes,
    FetchReturnHook,
    AllBasesUrl
} from "use-fetch";

export const useFetch = <
    URL extends `${AllBasesUrl}${URI}`,
    URI extends AvailableUris,
    HttpMethod extends keyof OpenAPI['paths'][URI],
    ContentType extends ContentTypeFromUri<URI, HttpMethod>,
    Body extends InterpretedRequestType<URI, HttpMethod, ContentType>
         = InterpretedRequestType<URI, HttpMethod, ContentType>,
    Return extends FetchReturnTypes<
        URI, HttpMethod
    > = FetchReturnTypes<
        URI, HttpMethod
    >
>(
    url: URI | URL, 
    options: {
        method: HttpMethod,
        headers?: ContentType extends undefined ? {} : {
            'Content-Type': ContentType
        }
    }
): FetchReturnHook<URI, HttpMethod, ContentType, Return, Body> => {
    const abortController = new AbortController();

    return {
        fetch: <T extends [body: Body]|[]>(...args: T) => {
            const { signal } = abortController;
            const [body] = args;

            const _options = body ? {
                ...options as RequestInit,
                body: body as unknown as BodyInit,
                signal
            } : {
                ...options as RequestInit,
                signal
            }

            return fetch(url, _options) as unknown as Promise<Exclude<Return, undefined>>;
        },
        abort(reason?: any) {
            abortController.abort(reason);
        }
    } as FetchReturnHook<URI, HttpMethod, ContentType, Return, Body>;
};
