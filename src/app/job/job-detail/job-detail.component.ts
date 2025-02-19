import { Component, OnInit } from '@angular/core';
import {JobService} from "../../service/job/job.service";
import {Job} from "../../model/job";
import {Company} from "../../model/company";
import {CompanyService} from "../../service/company/company.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {CvService} from "../../service/cv/cv.service";
import {Cv} from "../../model/cv";
import {UserService} from "../../service/user/user.service";
import Swal from "sweetalert2";
import {MailService} from "../../service/mail/mail.service";
import firebase from "firebase/compat";
import User = firebase.User;
import {ShowMessage} from "../../commom/show-message";

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  sub:Subscription;
  job: Job ={
  };

  companyList: Company |undefined;
  id: any;
  dataRole = localStorage.getItem("role")
  cvList:any;
  cvId: any;
  jobList: Job[] | undefined | any;
  cvs: Cv[] | undefined;
  companyImg: any;
  link: any;
  user2: any;
  user1: any;
  accept:any = false;
  remove:any = false;
  cvIdAccept:any;


  constructor(private jobService: JobService,
              private companyService: CompanyService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private cvService: CvService,
              private userService: UserService,
              private mailService: MailService,
              private showMasage:ShowMessage
  ) {
    this.sub = this.activatedRoute.paramMap.subscribe( (paramMap: ParamMap) => {
      // @ts-ignore
      this.id = +paramMap.get('id');
      this.getJobById(this.id);
      console.log(paramMap.keys)
      console.log(this.link)
      this.getJobByJobFieldId(this.id);
    })
  }

  applyCv(){
    if (this.cvId){
      this.cvService.findById(this.cvId).subscribe(data =>{
        console.log(this.cvId)
        this.jobService.findById(this.id).subscribe(jobData => {
          data.job = jobData
          this.cvService.editCv(data.id,data).subscribe(data=> {
            Swal.fire("Ứng tuyển thành công!")
          },error => console.log("Lỗi add Cv"))
        })
      })
    }else {
      alert("Hãy chọn CV!!")
    }
  }

  ngOnInit(): void {
    this.getAllCv();
    this.getCvByJobId();
  }

  getJobById(j: number) {
    this.jobService.findById(j).subscribe((result: any) => {
      console.log(this.job)
      this.job = result;
      console.log(result);
    }, (error: any) => {
      console.log(error);
    })
  }

  getAllCv(){
    this.cvService.findCVByUserId(this.getUserId()).subscribe(data=>{
      this.cvList = data;
      console.log("Đã lấy được list Cv by UserId")
    })
  }

  getUserId(){
    return localStorage.getItem("dataId");
  }

  getCvByJobId(){
    this.cvService.findCVByJobId(this.id).subscribe((data: any)=>{
      this.cvs = data;
    })
  }

  getJobByJobFieldId(j: number) {
    this.jobService.findById(j).subscribe((result: any) => {
      this.jobService.findJobByJobFieldId(this.job.jobField.id).subscribe((data: any) => {
        this.jobList = data
        console.log(data)
      })
    })
  }


  async confirmCv(id:any,cvId:any){
    this.userService.findById(id).subscribe(dataUser => {
      this.router.navigate(['http://localhost:4200/job/job-detail/'+ this.id])
      this.jobService.findById(this.id).subscribe(dataJob => {
        this.setCvAccept(cvId);
        this.showMasage.alertSuccess();
        this.mailService.sendMailApply(dataUser,dataJob.id).subscribe(result => {
            this.getCvByJobId();
          console.log("Gửi mail tới người ứng tuyển thành công!")
        }
        )
      })
    })
  }

  setCvAccept(id:any){
    this.cvService.findById(id).subscribe(data =>{
      data.apply = true;
      console.log(data)
      this.cvService.editCv(id,data).subscribe(result => {
        console.log("Đã sửa cv")
        console.log(result)
      });
    })
  }

  removeCv(id:any){
    this.cvService.findById(id).subscribe(data =>{
      data.job = null;
      this.cvService.editCv(id, data).subscribe(data => {
        console.log("Đã loại ứng viên!")
        this.getCvByJobId();
      })
    })
  }

  shareJob(){
    this.userService.findById(this.getUserId()).subscribe(data => {
      console.log(data.account.userName)
      console.log(this.user1)
      this.mailService.shareJob(data.account.userName,this.user2,this.id).subscribe(result =>{
        console.log("Đã chia sẻ việc làm")
      })
    })
  }


}
