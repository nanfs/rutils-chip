import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineEpics } from 'redux-observable';
import 'rxjs/add/operator/mergeMap';

function createEpic(epics) {
  const epic$ = new BehaviorSubject(combineEpics(...epics));
  function rootEpic(action$, store) {
    return epic$.mergeMap((epic) => {
      return epic(action$, store);
    });
  }
  function addEpics(newEpics) {
    newEpics.forEach((epic) => {
      epic$.next(epic);
    });
  }
  return {
    rootEpic,
    addEpics,
  };
}

export default createEpic;
