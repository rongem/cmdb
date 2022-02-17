npm update -g
cd ng-frontend
ng update @angular/cli @angular/core @angular/cdk @ngrx/store @angular-eslint/schematics
npm update
npm audit fix
grunt bump
ng build backend-access
ng build
cd ../njs-backend/
npm update
grunt bump
tsc --declaration && npm run test
npm outdate
read -n 1
