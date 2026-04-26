/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
//const ApiUrl = "http://127.0.0.1:8000/";

export const environment = {
  ApiUrl: "http://localhost:8001/api",
  // Solo el client_id — el client_secret NUNCA va al frontend
  googleClientId:   "579430784454-f072nkrq0cleqbm6he8ibk0rs338f7qf.apps.googleusercontent.com",
  googleRedirectUri: "http://localhost:4200/auth/google/callback",
};
