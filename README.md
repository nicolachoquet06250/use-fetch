# use-fetch
Test de création d'un hook useFetch avec un systeme de types qui adapte la sortie en fonction des paramètres d'entré par rapport à une doc open-api générée [par ChatGPT

# Get Started
- Clone the repo
- Run the command :
```sh
yarn
```
- Create `src/@types/openapi.d.ts` file with next code :
```ts
declare type OpenAPI = {
    // ... open api exported doc
}
```
- To test, update or create a component in the `vue 3` project
- Run the command :
```sh
yarn dev
```
- Enjoy yourself !