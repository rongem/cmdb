echo Updating global libraries
npm update --location=global
cd ng-frontend
echo Updating @angular
ng update @angular/cli @angular/core @angular/cdk @ngrx/store @angular-eslint/schematics --force --allow-dirty
echo Updating other libraries
npm update
npm audit fix
grunt bump
ng build backend-access
ng build cmdb
cd ../njs-backend/
echo Updating backend
npm update
grunt bump
tsc --declaration && npm run test
npm outdate
read -n 1
