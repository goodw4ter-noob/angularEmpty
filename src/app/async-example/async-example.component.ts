import { Component } from "@angular/core";
import { catchError, map, Observable, Subject, throwError } from "rxjs";
import { DependencyService } from "../dependency/dependency.service";


@Component({
  selector: "app-async-example",
  templateUrl: "./async-example.component.html",
  styleUrls: ["./async-example.component.scss"]
})
export class AsyncExampleComponent {
  public name!: string;
  public subjectExample: Subject<string> = new Subject<string>();

  constructor(private ds: DependencyService) { }

  public asyncExample(name?: string): Promise<string> {
    return new Promise((res, rej) => {
      if (!name) {
        rej('имя не указано');
        return;
      };

      setTimeout(() => res(name));
    });
  }

  public asyncSayHi(name: string): Promise<string> {
    return this.ds.asyncExample().then(result => {
      return `${result}, ${name}!`;
    }, () => {
      return "Сервис вернул ошибку!";
    });
  }

  public promiseExample(name?: string): Promise<void> {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (!name) {
          rej("Нет имени");
          return;
        }

        this.name = name;
        res();

      }, 3000)
    })
  }

  public observableExample(name?: string): Observable<string> {
    if (!name) {
      return throwError("нет имени");
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(name);
        observer.complete();
      }, 1000)
    });
  }

  public subjectExampleFn(name: string): void {
    this.subjectExample.next(name);
  }

  public sayHiObservable(name: string): Observable<string> {
    return this.ds.observableExampleDep()
      .pipe(
        map((data) => `${data} ${name}`),
        catchError(() => throwError('Сервис недоступен'))
      )
  }

  public setNameAfterOneMinute(name: string): void {
    setTimeout(() => {
      this.name = name;
    }, 60_000);
  }

}
