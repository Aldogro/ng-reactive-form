import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';

import { Customer } from './customer';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('email2');

  if ( emailControl.pristine || confirmControl.pristine ) {
    return null;
  }

  if ( emailControl.value === confirmControl.value ) {
    return null;
  }
  return { match: true };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer: Customer = new Customer();

  get addresses(): FormArray{
    return <FormArray>this.customerForm.get('addresses');
  }

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: [{ value: null, disabled: false }, [Validators.required, Validators.minLength(3)]],
      lastName: [{ value: null, disabled: false }, [Validators.required, Validators.minLength(3)]],
      emailGroup: this.fb.group({
        email: [{ value: null, disabled: false }, [Validators.required, Validators.email]],
        email2: [{ value: null, disabled: false }, [Validators.required]]
      }, { validator: emailMatcher }),
      sendCatalog: [false, [Validators.required]],
      phone: [null],
      notification: ['email'],
      addresses: this.fb.array([this.buildAddress()])
    });

    this.customerForm.get('notification').valueChanges
    .subscribe( data => {
      this.setNotification( data );
    });
  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  populateTestData() {
    // tslint:disable-next-line:no-string-literal
    console.log(this.customerForm.get('emailGroup').get('email').hasError('required'));
    this.customerForm.patchValue({
      firstName: 'Pepe',
      lastName:  'Pipi',
      emailGroup: {
        email: 'aaaaaaa@gmail.com',
        email2: 'bbbbb@gmail.com'
      },
      phone: 3413668923,
      notification: 'email'
    });
  }

  save() {
    console.log(this.customerForm);
  }

  setNotification(notification: string): void {
    const phoneControl = this.customerForm.get('phone');
    if ( notification === 'text' ) {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
}
