import EmployeeModel, { Employee } from "../models/employee.model";

export function createEmployee(input:Partial<Employee>){
    return EmployeeModel.create(input);
}

export function  findEmployeeById(id:string){
    return EmployeeModel.findById(id);
}

export function findEmployeeByEmail(email:string){
    return EmployeeModel.findOne({email});
}