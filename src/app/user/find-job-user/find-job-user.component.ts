import { Component, OnInit } from '@angular/core';
import {FindJobService} from "../../service/find-job.service";
import {JobFieldService} from "../../service/jobField/job-field.service";
import {JobField} from "../../model/job-field";
import {LocationService} from "../../service/location/location.service";
import {Location} from "../../model/location";
import {CompanyService} from "../../service/company/company.service";
import {Company} from "../../model/company";
import {JobService} from "../../service/job/job.service";
import {Job} from "../../model/job";

@Component({
  selector: 'app-find-job-user',
  templateUrl: './find-job-user.component.html',
  styleUrls: ['./find-job-user.component.css']
})
export class FindJobUserComponent implements OnInit {

  salaryRangeList:number[] = [1000000,2000000,3000000,4000000,5000000,6000000,7000000,8000000];

  salaryRange:number | undefined;

  public name = '';
  public jobField = '';
  public location = '';
  public company = '';
  jobFieldList: JobField[]=[]
  locationList: Location[]=[]
  companyList: Company[]=[]
  jobList: Job[]=[]

  constructor(private FindJobService: FindJobService,
              private JobFieldService: JobFieldService,
              private LocationService: LocationService,
              private CompanyService: CompanyService,
              private JobService: JobService) { }

  ngOnInit(): void {
    this.getAllJobField()
    this.getAllLocation()
    this.getAllCompany()
    this.getAllJob()

  }
  getSearch(pageable: any) {
    console.log(this.name)
    console.log(this.salaryRange)
    console.log(this.jobField)
    console.log(this.location)
    console.log(this.company)
    console.log("f")
    this.FindJobService.getAllJobBy(this.name, this.salaryRange, this.jobField, this.location, this.company).subscribe(data => {
      console.log(data)
    });
  }
  getAllJob() {
    this.JobService.getAll().subscribe((result: any) => {
      this.jobList = result;
      console.log(result)
    }, (error: any) => {
      console.log(error);
    })
  }

  getAllJobField() {
    this.JobFieldService.getAll().subscribe((result: any) => {
      this.jobFieldList = result;
    }, (error: any) => {
      console.log(error);
    })
  }
  getAllLocation() {
    this.LocationService.getAll().subscribe((result: any) => {
      this.locationList = result;
    }, (error: any) => {
      console.log(error);
    })
  }
  getAllCompany() {
    this.CompanyService.getAll().subscribe((result: any) => {
      this.companyList = result;
    }, (error: any) => {
      console.log(error);
    })
  }
  formatLabel(value: number) {
    if (value >= 1000000) {
      return Math.round(value / 1000000) + 'tr';
    }
    return value;
  }
  getCode(id: number, size: number): string {
    let num = id.toString();
    while (num.length < size) {
      num = '0' + num;
    }
    return 'BN-' + num;
  }


}
