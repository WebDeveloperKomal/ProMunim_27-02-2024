import { Component } from '@angular/core';
import { UserRolePermissionModel } from './user-role-permission.component.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { DepartmentModel } from '../department/department.component.model';
import { EmployeeModel } from '../employee/employee.component.model';
import { SecurityService } from '../security.service';
import Swal from 'sweetalert2';
import { PermissionsModel } from '../login/permissionsModel';

@Component({
  selector: 'app-user-role-permission',
  templateUrl: './user-role-permission.component.html',
  styleUrls: ['./user-role-permission.component.css']
})

export class UserRolePermissionComponent {
  updaterole !: FormGroup;
  addUserRoleForm !: FormGroup;
  SearchText : any ;
  page = 1;
  page1 = 1;
  pageSize = 10 ;
  pageSize1 = 10 ;
  dataarray: UserRolePermissionModel[] = [];
  currentPage: number = 1;
  countries: UserRolePermissionModel[] | undefined;
  countries1: EmployeeModel[] | undefined;
  collectionSize =100;
  activeTab: string = 'tab1';
  showdata1 : boolean = true;
  showdata : boolean = false;
  showdata2 : boolean = true;
  showdata3 : boolean = false;

  RolesList:UserRolePermissionModel[]=[];
  allDepartments:DepartmentModel[]=[];
  allEmployees:EmployeeModel[]=[];
  allPermissionTypes=[{
    permissionId: 0,
    permissionTypeId: 0,
    typeName: "",
    permissionTypeName: "",
    typeId: 0,
    permissionName: ""
  }];
  NewRolePermissions={
    roleName : "",
    parentId : "",
    departmentId : 0,
    PermissionRule: [] as number[]
  };
  PermissionsData:PermissionsModel[]=[];
  permissionsByID:number[]=[];
  updateUserRoleForm={
    empId:0,
    roleId:0
  }
  RolePermissionsById: number[] = [];
  ROLEIDtoUpdate=0;
  updateRolePermissions={
    roleId:0,
    parentRoleId:'',
    departmentId:0,
    PermissionRule: [] as number[]

  };
  persRule:any;
  showAllPers:any;

    
  permissions: any;
  Perstring:any;
  insertRole!:boolean;
  deleteRole!:boolean;
  updateRole!:boolean;
  view!:boolean;
  viewRM!:boolean;
  viewbranch!:boolean;
  viewall!:boolean;

  constructor(private formBuilder: FormBuilder, private apiService:ApiService, private service:SecurityService) {
    this.updaterole = this.formBuilder.group({
      parentRoleId: ['', Validators.required], // Add validation if needed
      departmentId: ['', Validators.required],
     });

    this.addUserRoleForm = this.formBuilder.group({
      empId: ['', Validators.required], 
      roleId: ['', Validators.required],
     });
  }


  /***************************************** ROLE BLOCK ***************************************/

  ngOnInit(){ 
    this.Perstring = localStorage.getItem('permissions');
    if (this.Perstring) {
      this.permissions = JSON.parse(this.Perstring);
      this.permissions.forEach((permission: number) => {
        if (permission === 1098){this.insertRole = true};
        if (permission === 1099){this.deleteRole = true};
        if (permission === 1100){this.updateRole = true};
        if (permission === 1101){this.view = true};
        if (permission === 1102){this.viewRM = true};
        if (permission === 1103){this.viewbranch = true};
        if (permission === 1104){this.viewall = true};
      });
    } else {
      console.log('No permissions data found.');
    };

    this.apiService.allRoles().subscribe(
      (res:any)=>{this.RolesList = res.data
      this.collectionSize = res.data.length;
      },
      (err:any)=>{console.error(err);
      }
    );
    this.apiService.allDepartments().subscribe(
      (res:any)=>{this.allDepartments = res.data},
      (err:any)=>{console.error(err);
      }
    );
    this.apiService.allPermissionTypes().subscribe(
      (res:any)=>{this.allPermissionTypes = res.data;
      },
      (err:any)=>{console.error(err);
      }
    );
    this.service.allEmployees().subscribe(
      (res:any)=>{this.allEmployees = res.data;
      },
      (err:any)=>{console.error(err);
      }
    );
  }


  addPermissionRule(index: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    // If the checkbox is checked, add the corresponding integer to the array
    // If unchecked, remove it from the array
    if (checkbox.checked) {
      this.NewRolePermissions.PermissionRule.push(index);
    } else {
      const indexToRemove = this.NewRolePermissions.PermissionRule.indexOf(index);
      if (indexToRemove !== -1) {
        this.NewRolePermissions.PermissionRule.splice(indexToRemove, 1);
      }
    }
  }

    
  addNewRole(){
    console.log(this.NewRolePermissions);
    this.apiService.addRolesAndPermissions(this.NewRolePermissions).subscribe(
      (res:any)=>{
        console.log(res.data);
        Swal.fire({
          title: "Record Saved!",
          icon: "success"
        });   
      },
      (err:any)=>{
        console.error(err);
        Swal.fire({
          title: "Error!",
          icon: "error"
        });   
      }
    );
  // setInterval(()=>{window.location.reload()},1000);        
  }

  getPermissionsByRoleId(id:any):any{
    this.apiService.permissionsByRoleId(id).subscribe(
      (response:any)=>{
        this.PermissionsData = response.data;
        this.permissionsByID = this.PermissionsData.map(permissionType => permissionType.rolePermissionTypeId);
        console.log('permissions ::::::::::::::::::: ', this.permissionsByID); 
      },
      (error:any)=>{
        console.error(error);
      }
    );
  }

  updatePermissionRule(index: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    // If the checkbox is checked, add the corresponding integer to the array
    // If unchecked, remove it from the array
    if (checkbox.checked) {
      this.updateRolePermissions.PermissionRule.push(index);
    } else {
      const indexToRemove = this.updateRolePermissions.PermissionRule.indexOf(index);
      if (indexToRemove !== -1) {
        this.updateRolePermissions.PermissionRule.splice(indexToRemove, 1);
      }
    }
  }
 
  // isChecked(permission: number): boolean {
  //   return this.persRule.includes(permission);
  // }

  edit(id:any){
    this.ROLEIDtoUpdate=id;
  }
  editRolePermissions(){
    this.updateRolePermissions.roleId = this.ROLEIDtoUpdate;
    this.apiService.updateRolesAndPermissions(this.updateRolePermissions).subscribe(
      (response:any)=>{
        console.log(response);   
        Swal.fire({
          title: "Record Saved!",
          icon: "success"
        });      
      },
      (error:any)=>{
        console.error(error);
        Swal.fire({
          title: "Error!",
          icon: "error"
        }); 
      }
    );
    // setInterval(()=>{window.location.reload()},1000);        
  }
  
  delete(id:number){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
      }).then((result) => {
      if (result.isConfirmed) 
      {
        this.apiService.deleteRole(id).subscribe(
          (response:any)=>{
            console.log(response); 
            Swal.fire({
              title: "Record Deleted!",
              icon: "success"
            });
          },
          (error:any)=>{
            console.error(error);
            Swal.fire({
              title: "Error!",
              icon: "error"
            });
          }
        );
        // setInterval(()=>{window.location.reload()},1000);        
      }
    });
    
  }


  applyFilter(): void {
    const searchString = this.SearchText.toLowerCase();
    const filteredData = [...this.RolesList];
    this.RolesList = filteredData.filter((data) =>
      data.departmentName.toLowerCase().includes(searchString) ||
      data.parentId.toLowerCase().includes(searchString) ||
      data.roleName.toLowerCase().includes(searchString) 
    );

  }
  refreshCountries() {
    this.countries = this.RolesList
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  
  refreshCountries1() {
    this.countries1 = this.allEmployees
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }




  /***************************************** USER ROLE AND PERMISSIONS BLOCK ***************************************/

  addNewUserRole(){
    console.log(this.addUserRoleForm.value);
    this.apiService.addNewUserRole(this.addUserRoleForm.value).subscribe(
      (res:any)=>{
        console.log(res.data);
        Swal.fire({
          title: "Record Saved!",
          icon: "success"
        });   
      },
      (err:any)=>{
        console.error(err);
        Swal.fire({
          title: "Error!",
          icon: "error"
        });   
      }
    );
  }


  checkPermissionRule(num: number):boolean {
    return this.persRule.includes(num)
  }


  updateUserRole(){
    console.log(this.updateUserRoleForm);
    this.apiService.UpdateUserRole(this.updateUserRoleForm).subscribe(
      (res:any)=>{
        console.log(res.data);
        Swal.fire({
          title: "Record Saved!",
          icon: "success"
        });   
      },
      (err:any)=>{
        console.error(err);
        Swal.fire({
          title: "Error!",
          icon: "error"
        });   
      }
    );
    // setInterval(()=>{window.location.reload()},1000);        
  }






applyFilter1(): void {
  const searchString = this.SearchText.toLowerCase();
  const filteredData = [...this.allEmployees];
  this.allEmployees = filteredData.filter((data) =>
    data.firstName.toLowerCase().includes(searchString) ||
    data.middleName.toLowerCase().includes(searchString) ||
    data.lastName.toLowerCase().includes(searchString) ||
    data.userName.toLowerCase().includes(searchString) ||
    data.roleName.toLowerCase().includes(searchString) 
    // (data.parentId !== null && !isNaN(data.parentId) && data.parentId.toString().includes(searchString)) 
   
  );

}



changeTab(tabId: string) {
  this.activeTab = tabId;
}

switchTabBasedOnId(id: string) {
  if (id === 'tab1') {
    this.activeTab = 'tab1';
  } else if (id === 'tab2') {
    this.activeTab = 'tab2';
  }else if (id === 'tab3') {
    this.activeTab = 'tab3';
  }
}


shownewrole(){
  this.showdata = !this.showdata;
  this.showdata1 = !this.showdata1
}

shownewrole1(){
  this.showdata2 = !this.showdata2;
  this.showdata3 = !this.showdata3
}
}