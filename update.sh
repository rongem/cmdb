npm update -g
cd ng-frontend
ng update @angular/cli @angular/core @angular/material @ngrx/store @angular-eslint/schematics
npm update
npm audit fix
ng build backend-access
ng build
cd ../njs-backend/
npm update
tsc --declaration && npm run test
npm outdate
read -n 1
