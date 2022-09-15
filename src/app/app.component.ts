import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Course } from './course/interfaces/course.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  courses$!: Observable<Course[]>;
  beginnerCourses$!: Observable<Course[]>;
  mediumCourses$!: Observable<Course[]>;
  advanceCourses$!: Observable<Course[]>;
  isLoading: boolean = false

  isHiddenAllCourses: boolean = false;
  isHiddenBeginnerCourses!: boolean;
  isHiddenMediumCourses!: boolean;
  isHiddenAdvanceCourses!: boolean;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.courses$ = this.getUsers().pipe(
      map(result => result.courses),
      // Run our observable and make only 1 api request
      shareReplay()
    )
  }

  getAllCourses(value: string) {
    this.showCourseCategory(value);
  }

  getBeginnerCourses$(value: string) {
    this.showCourseCategory(value);
// map only the beginner courses
    this.beginnerCourses$ = this.courses$.pipe(
      tap(() => this.isLoading = true),
      finalize(() => {
        this.isLoading = false;
      }),
      map(
        courses => courses
          .filter((course: { category: string; }) => course.category === 'BEGINNER')
      ))
  }

  getMediumCourses$(value: string) {
    this.showCourseCategory(value);
// map only the medium courses
    this.mediumCourses$ = this.courses$.pipe(
      tap(() => this.isLoading = true),
      finalize(() => {
        this.isLoading = false;
      }),
      map(
        courses => courses
          .filter((course: { category: string; }) => course.category === 'MEDIUM'))
    );
  }

  getAdvanceCourses$(value: string) {
    this.showCourseCategory(value);
// map only the advance courses
    this.advanceCourses$ = this.courses$.pipe(
      tap(() => this.isLoading = true),
      finalize(() => {
        this.isLoading = false;
      }),
      map(
        courses => courses
          .filter((course: { category: string; }) => course.category === 'ADVANCED')
      )
    );
  }

  showCourseCategory(value: string) {
    switch (value) {
      case "BEGINNER":
        this.isHiddenAllCourses = true;
        this.isHiddenBeginnerCourses = false;
        this.isHiddenMediumCourses = true;
        this.isHiddenAdvanceCourses = true;
        break;
      case "MEDIUM":
        this.isHiddenAllCourses = true;
        this.isHiddenBeginnerCourses = true;
        this.isHiddenMediumCourses = false;
        this.isHiddenAdvanceCourses = true;
        break;
      case "ADVANCED":
        this.isHiddenAllCourses = true;
        this.isHiddenBeginnerCourses = true;
        this.isHiddenMediumCourses = true;
        this.isHiddenAdvanceCourses = false;
        break;
      default:
        this.isHiddenAllCourses = false;
        this.isHiddenBeginnerCourses = true;
        this.isHiddenMediumCourses = true;
        this.isHiddenAdvanceCourses = true;
        break;
    }
  }

  //Http Client get method
  private getUsers(): Observable<any> {
    const url = 'https://68b8ba75-2936-4173-9b19-f6629f551f33.mock.pstmn.io/extract-all-courses';
    return this.http.get<any>(url);
  }
}
