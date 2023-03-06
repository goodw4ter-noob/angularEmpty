import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { DependencyService } from "../dependency/dependency.service";
import { AsyncExampleComponent } from "./async-example.component";

describe("AsyncExampleComponent", () => {
  let component: AsyncExampleComponent;
  let fixture: ComponentFixture<AsyncExampleComponent>;

  const fakeDependencyService = jasmine.createSpyObj('fakeDepService', ['asyncExample', 'observableExampleDep']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsyncExampleComponent],
      providers: [
        { provide: DependencyService, useValue: fakeDependencyService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("asyncExample возвращает промис с указанными параметрами - async/await", async () => {
    const result = await component.asyncExample('Alice');
    expect(result).toBe("Alice");
  });

  it("asyncExample реджектит промис без указания параметров - async/await", async () => {
    try {
      await component.asyncExample();
    } catch (error) {
      expect(error).toBe('имя не указано');
    }
  });

  it("asyncSayHi, выводит строку с приветствием для указанного имени", async () => {
    fakeDependencyService.asyncExample.and.returnValue(Promise.resolve('Hello'));
    const result = await component.asyncSayHi('Bob');
    expect(result).toBe('Hello, Bob!');
  });

  it("asyncSayHi, выводит строку с приветствием для указанного имени", async () => {
    fakeDependencyService.asyncExample.and.returnValue(Promise.resolve('Hello'));
    const result = await component.asyncSayHi('Bob');
    expect(result).toBe('Hello, Bob!');
  });

  it("asyncSayHi, выводит ошибку, если сервис выводит ошибку", async () => {
    fakeDependencyService.asyncExample.and.returnValue(Promise.reject());
    const result = await component.asyncSayHi('Bob');
    expect(result).toBe('Сервис вернул ошибку!');
  });

  it("asyncExample возвращает промис с указанными параметрами - PROMISE", () => {
    return component.asyncExample("Alice").then(result => {
      expect(result).toBe("Alice");
    });
  });

  it("asyncExample реджектит промис без указания параметров - PROMISE", () => {
    return component.asyncExample().then(undefined, error => {
      expect(error).toBe("имя не указано");
    })
  })

  it("promiseExample присваивает указанное имя поля класса", () => {
    return component.promiseExample("Dan").then(() => {
      expect(component.name).toBe("Dan");
    })
  })

  it("asyncSayHi, выводит строку с приветствием для указанного имени", () => {
    fakeDependencyService.asyncExample.and.returnValue(Promise.resolve("Hello"));
    return component.asyncSayHi("Alice").then(res => {
      expect(res).toBe('Hello, Alice!');
    })
  })

  // Тестирование observable

  it("asyncExample возвращает промис с указанными параметрами - callback done", done => {
    component.asyncExample("Alice").then(res => {
      expect(res).toBe("Alice");
      done();
    })
  });

  it("asyncExample реджектит промис без указанного имени - callback done", done => {
    component.asyncExample().then(
      res => {
        expect(res).toBe("Alice");
        done();
      }, err => {
        expect(err).toBe('имя не указано');
        done();
      })
  });

  it("observableExample возвращает переданное значение - callback done", done => {
    component.observableExample("Den").subscribe(
      result => {
        expect(result).toBe("Den");
        done();
      })
  })

  it("observableExample возвращает ошибку, если значение не передано - callback done", done => {
    component.observableExample().subscribe(
      result => {
        expect(result).toBe("Den");
        done();
      },
      error => {
        expect(error).toBe("нет имени");
        done();
      })
  })

  it("subjectExampleFn записывает имя в поле класса subject - callback done", done => {
    component.subjectExample.subscribe(result => {
      expect(result).toBe("Alice");
      done();
    })
    component.subjectExampleFn("Alice");
  })

  it("sayHiObservable возвращает приветствие по указанному имени - callback done", done => {
    fakeDependencyService.observableExampleDep.and.returnValue(of('Hello'));
    component.sayHiObservable("Dan").subscribe(result => {
      expect(result).toBe("Hello Dan");
      done();
    })
  });

  it("sayHiObservable возвращает ошибку - callback done", done => {
    fakeDependencyService.observableExampleDep.and.returnValue(throwError('Сервис недоступен'));
    component.sayHiObservable("Dan")
      .subscribe(result => {
        expect(result).toBe("Hello Dan");
        done();
      },
      error => {
        expect(error).toBe('Сервис недоступен');
        done();
      }
      )
  });

  it("setNameAfterOneMinute присваивает новое значение полю name через 1 минуту", () => {
    jasmine.clock().install();
    component.setNameAfterOneMinute("Alice");
    jasmine.clock().tick(60_000);
    expect(component.name).toBe("Alice");
    jasmine.clock().uninstall();
  })
  //ass
});
