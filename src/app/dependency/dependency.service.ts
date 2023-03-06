import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DependencyService {
  constructor() { }

  public asyncExample(): Promise<string> {
    return new Promise(res => {
      setTimeout(() => {
        res('Hello');
      }, 3000);
    })
  }

  public observableExampleDep(): Observable<string> {
    return new Observable<string>(observer => {
      setTimeout(() => {
        observer.next('Hello');
        observer.complete();
      }, 1000)
    })
  }

}
