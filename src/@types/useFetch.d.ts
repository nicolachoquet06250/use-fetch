declare module 'useFetch' {
    import type {
        APIContentType,
        APIHeaders,
        APIHttpCode,
        APIMethod, APIPath,
        APIResponse,
        APIServers,
        Responses
    } from "use-fetch";

    type UseFetchParams<
        U extends APIPath, 
        M extends APIMethod<U>,
        Accept extends APIContentType<Responses<U, M>>,
        Headers extends APIHeaders<U, M, Accept>,
        Body extends APIPathParameters<U, M> 
            = APIPathParameters<U, M>
    > = Body extends never ? [
        url: U | `${APIServers}/${U}`,
        httpVerb: M,
        headers: Headers
    ] : [
        url: U | `${APIServers}/${U}`,
        httpVerb: M,
        headers: Headers,
        body: Body
    ];

    const useFetch = async <
        U extends APIPath, 
        M extends APIMethod<U>,
        Accept extends APIContentType<Responses<U, M>> = APIContentType<Responses<U, M>>,
        Code extends APIHttpCode<U, M> = APIHttpCode<U, M>,
        FinalResponse = APIResponse<U, M, Accept, Code>,
        Headers extends APIHeaders<U, M, Accept> = APIHeaders<U, M, Accept>
    >(...args: UseFetchParams<U, M, Accept, Headers>): Promise<{
        code: Code,
        accept: Accept,
        response: FinalResponse
    }> => {
        const [url, method, headers, body = undefined] = args;
        const bodyObj = body ? { body: body as BodyInit } : {};

        const options: RequestInit = {
            method: method as string, 
            headers: headers as HeadersInit,
            ...bodyObj
        };

        return await fetch(url, options)
            .then((r: Response) => {
                return {
                    code: `${r.status}` as Code,
                    accept: (headers as unknown as { Accept: string }).Accept as Accept,
                    response: r[
                        (headers as unknown as { Accept: string }).Accept.startsWith('text/') 
                            || (headers as unknown as { Accept: string }).Accept === 'plain/text' 
                            ? 'text' : 'json'
                    ]() as FinalResponse
                };
            });
    };
}