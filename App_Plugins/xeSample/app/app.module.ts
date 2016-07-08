import { provide } from "ng-metadata/core";

import { AppCmp } from "./components/my-app.component";
import { AskCmp } from "./components/ask.component";
import { QuestionSvc } from "./services/question.service";
import { mdReadParamsComponent } from "./components/md-read-params.component";
import { mdEventStoreDirective } from "./components/md-event-store.directive";

 
// return/export the module so you can later bootsrap it in the startup using ngMetadata
// define  'app'   module and register all  components  and  services  defined in other files imported above...
export const AppModule = angular.module( "app", [] )
  .directive( ...provide( AppCmp ) )
  .directive( ...provide( AskCmp ) )
  .directive( ...provide( mdReadParamsComponent ))
  .directive( ...provide( mdEventStoreDirective ))
  .service( ...provide( QuestionSvc ) )
  .name
;
