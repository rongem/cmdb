echo Updating global libraries
npm outdated --location=global
npm update --location=global
cd ng-frontend
echo Updating @angular
ng update @angular/cli @angular/core @angular/cdk @ngrx/store @angular-eslint/schematics --force --allow-dirty
echo Updating other libraries
npm install https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz
npm update
npm audit fix
grunt bump
npm prune
npm outdated
ng build backend-access
ng build cmdb
cd ../njs-backend/
echo Updating backend
npm install https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz
npm update
grunt bump
npm prune
tsc --declaration && npm run test
npm outdate
read -n 1
