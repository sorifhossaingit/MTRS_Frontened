import { Component, OnInit } from '@angular/core';

import {
  PackagePlus,
  ArrowLeft,
  Package,
  ClipboardList,
  DollarSign,
  Box,
  FileCheck,
  TrendingUp,
  CheckCircle,
  Save,
  Boxes
} from 'lucide-angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product-master',
  templateUrl: './add-product-master.component.html',
  styleUrl: './add-product-master.component.css'
})
export class AddProductMasterComponent implements OnInit {

  // =========================================================
  // 🔷 ICONS
  // =========================================================

  PackagePlus = PackagePlus;
  ArrowLeft = ArrowLeft;
  Package = Package;
  ClipboardList = ClipboardList;
  DollarSign = DollarSign;
  Box = Box;
  FileCheck = FileCheck;
  TrendingUp = TrendingUp;
  CheckCircle = CheckCircle;
  Save = Save;
  Boxes = Boxes;
  // =========================================================
  // 🔷 VARIABLES
  // =========================================================

  productForm!: FormGroup;

  submitted = false;

  agencyId: any =
    localStorage.getItem('aid');

  createdBy: any;

  selectedImage: any;

  imagePreview: any;

  // =========================================================
  // 🔷 CONSTRUCTOR
  // =========================================================

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService
  ) { }

  // =========================================================
  // 🔷 INIT
  // =========================================================

  ngOnInit(): void {

    this.getUserIdFromToken();

    this.initializeForm();

  }

  // =========================================================
  // 🔷 FORM INIT
  // =========================================================

  initializeForm() {

    this.productForm = this.fb.group({

      agencyId: [this.agencyId],

      name: [
        '',
        Validators.required
      ],

      brandName: [
        '',
        Validators.required
      ],

      genericName: [
        '',
        Validators.required
      ],

      category: [
        '',
        Validators.required
      ],

      dosageForm: [
        '',
        Validators.required
      ],

      strength: [
        '',
        Validators.required
      ],

      mrp: [
        '',
        Validators.required
      ],

      ptr: [
        '',
        Validators.required
      ],

      pts: [
        '',
        Validators.required
      ],

      packSize: [
        '',
        Validators.required
      ],

      unitsPerBox: [
        '',
        Validators.required
      ],

      launchDate: [
        '',
        Validators.required
      ],

      division: [
        '',
        Validators.required
      ],

      manufacturingLicenseNumber: [
        '',
        Validators.required
      ],

      approvalDate: [
        '',
        Validators.required
      ],

      promotionPriority: [
        1,
        Validators.required
      ],

      quantity: [0, [Validators.required, Validators.min(0)]],

      createdBy: [0],

      imageUrl: [''],

      imageFile: [null]

    });

  }

  // =========================================================
  // 🔷 TOKEN DECODE
  // =========================================================

  getUserIdFromToken() {

    const token =
      localStorage.getItem('token');

    if (token) {

      const decodedToken: any =
        jwtDecode(token);

      this.createdBy =
        decodedToken?.userId ||
        decodedToken?.UserId ||
        decodedToken?.id;

    }

  }

  // =========================================================
  // 🔷 IMAGE CHANGE
  // =========================================================

  onImageChange(event: any) {

    const file = event.target.files[0];

    if (file) {

      this.selectedImage = file;

      this.productForm.patchValue({
        imageFile: file
      });

      const reader = new FileReader();

      reader.onload = () => {

        this.imagePreview = reader.result;

      };

      reader.readAsDataURL(file);

    }

  }

  // =========================================================
  // 🔷 SAVE PRODUCT
  // =========================================================

  saveProduct() {

    this.submitted = true;

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
        confirmButtonColor: '#f59e0b'
      });

      return;

    }

    const formValue =
      this.productForm.value;

    const formData =
      new FormData();

    formData.append(
      'AgencyId',
      this.agencyId
    );

    formData.append(
      'Name',
      formValue.name
    );

    formData.append(
      'BrandName',
      formValue.brandName
    );

    formData.append(
      'GenericName',
      formValue.genericName
    );

    formData.append(
      'Category',
      formValue.category
    );

    formData.append(
      'DosageForm',
      formValue.dosageForm
    );

    formData.append(
      'Strength',
      formValue.strength
    );

    formData.append(
      'Mrp',
      formValue.mrp
    );

    formData.append(
      'Ptr',
      formValue.ptr
    );

    formData.append(
      'Pts',
      formValue.pts
    );

    formData.append(
      'PackSize',
      formValue.packSize
    );

    formData.append(
      'UnitsPerBox',
      formValue.unitsPerBox
    );

    formData.append(
      'LaunchDate',
      formValue.launchDate
    );

    formData.append(
      'Division',
      formValue.division
    );

    formData.append(
      'ManufacturingLicenseNumber',
      formValue.manufacturingLicenseNumber
    );

    formData.append(
      'ApprovalDate',
      formValue.approvalDate
    );

    formData.append(
  'Quantity',
  formValue.quantity
);

    formData.append(
      'PromotionPriority',
      formValue.promotionPriority
    );

    formData.append(
      'CreatedBy',
      this.createdBy
    );

    formData.append(
      'ImageUrl',
      ''
    );

    if (this.selectedImage) {

      formData.append(
        'imageFile',
        this.selectedImage
      );

    }

    this.productService
      .addproduct(formData)
      .subscribe({

        next: (res: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product Added Successfully',
            confirmButtonColor: '#16a34a'
          }).then(() => {

            this.router.navigate([
              '/product-master/product-master-dashboard'
            ]);

          });

        },

        error: (err: any) => {

          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text:
              err?.error?.message ||
              'Something went wrong',
            confirmButtonColor: '#dc2626'
          });

        }

      });

  }

  // =========================================================
  // 🔷 FORM CONTROLS
  // =========================================================

  get f() {

    return this.productForm.controls;

  }

}
