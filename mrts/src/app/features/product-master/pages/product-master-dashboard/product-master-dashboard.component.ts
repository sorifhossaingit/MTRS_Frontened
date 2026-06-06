import { Component, OnInit } from '@angular/core';

import {
  Package,
  Plus,
  Upload,
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { jwtDecode } from 'jwt-decode';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-master-dashboard',
  templateUrl: './product-master-dashboard.component.html',
  styleUrl: './product-master-dashboard.component.css'
})
export class ProductMasterDashboardComponent implements OnInit {

  // =========================================================
  // 🔷 ICONS
  // =========================================================

  Package = Package;
  Plus = Plus;
  Upload = Upload;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  TrendingUp = TrendingUp;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;
  X = X;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) { }

  // =========================================================
  // 🔷 STORAGE
  // =========================================================

  agencyId: any = localStorage.getItem('aid');

  updatedBy: any;

  // =========================================================
  // 🔷 DASHBOARD
  // =========================================================

  totalProducts = 0;
  activeProducts = 0;
  inactiveProducts = 0;
  topProducts = 0;

  // =========================================================
  // 🔷 FILTERS
  // =========================================================

  name = '';
  brandName = '';
  genericName = '';
  category = '';
  dosageForm = '';

  // =========================================================
  // 🔷 PAGINATION
  // =========================================================

  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  // =========================================================
  // 🔷 DATA
  // =========================================================

  productList: any[] = [];

  selectedProduct: any;

  // =========================================================
  // 🔷 MODAL
  // =========================================================

  showViewModal = false;

  showEditModal = false;

  // =========================================================
  // 🔷 FORM
  // =========================================================

  productForm!: FormGroup;

  submitted = false;

  selectedImage: any;

  // =========================================================
  // 🔷 INIT
  // =========================================================

  ngOnInit(): void {

    this.getUserIdFromToken();

    this.initializeForm();

    this.getProductDetails();

  }

  // =========================================================
  // 🔷 FORM
  // =========================================================

  initializeForm() {

    this.productForm = this.fb.group({

      productId: [0],

      agencyId: [this.agencyId],

      name: ['', Validators.required],

      brandName: ['', Validators.required],

      genericName: ['', Validators.required],

      category: ['', Validators.required],

      dosageForm: ['', Validators.required],

      strength: ['', Validators.required],

      mrp: [0, Validators.required],

      ptr: [0, Validators.required],

      pts: [0, Validators.required],

      packSize: ['', Validators.required],

      unitsPerBox: [0, Validators.required],

      launchDate: ['', Validators.required],

      division: ['', Validators.required],

      manufacturingLicenseNumber: ['', Validators.required],

      approvalDate: ['', Validators.required],

      promotionPriority: [1],

      isActive: [true],

      updatedBy: [0],

      imageUrl: [''],

      imageFile: [null]

    });

  }

  // =========================================================
  // 🔷 TOKEN
  // =========================================================

  getUserIdFromToken() {

    const token = localStorage.getItem('token');

    if (token) {

      const decodedToken: any = jwtDecode(token);

      this.updatedBy =
        decodedToken?.userId ||
        decodedToken?.UserId ||
        decodedToken?.id;

    }

  }

  // =========================================================
  // 🔷 GET PRODUCTS
  // =========================================================

  getProductDetails() {

    const params = {

      AgencyId: this.agencyId,

      Name: this.name,

      BrandName: this.brandName,

      GenericName: this.genericName,

      Category: this.category,

      DosageForm: this.dosageForm,

      pageNumber: this.pageNumber,

      pageSize: this.pageSize

    };

    this.productService
      .getproductdetails(params)
      .subscribe({

        next: (res: any) => {

          this.productList = res?.data || [];

          this.totalRecords = res?.totalCount || 0;

          this.totalPages = Math.ceil(
            this.totalRecords / this.pageSize
          );

          this.totalProducts = res?.totalCount || 0;

          this.activeProducts =
            this.productList.filter(
              (x: any) => x.isActive
            ).length;

          this.inactiveProducts =
            this.productList.filter(
              (x: any) => !x.isActive
            ).length;

          this.topProducts =
            this.productList.filter(
              (x: any) =>
                x.promotionPriority === 1
            ).length;

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =========================================================
  // 🔷 FILTER
  // =========================================================

  applyFilter() {

    this.pageNumber = 1;

    this.getProductDetails();

  }

  // =========================================================
  // 🔷 RESET
  // =========================================================

  resetFilter() {

    this.name = '';
    this.brandName = '';
    this.genericName = '';
    this.category = '';
    this.dosageForm = '';

    this.pageNumber = 1;

    this.getProductDetails();

  }

  // =========================================================
  // 🔷 PAGINATION
  // =========================================================

  nextPage() {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.getProductDetails();

    }

  }

  previousPage() {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.getProductDetails();

    }

  }

  // =========================================================
  // 🔷 VIEW
  // =========================================================

  viewProduct(item: any) {

    this.selectedProduct = item;

    this.showViewModal = true;

  }

  closeViewModal() {

    this.showViewModal = false;

  }

  // =========================================================
  // 🔷 EDIT
  // =========================================================

  editProduct(item: any) {

    this.selectedProduct = item;

    this.selectedImage = null;

    this.showEditModal = true;

    this.productForm.patchValue({

      productId: item.productId,

      agencyId: this.agencyId,

      name: item.name,

      brandName: item.brandName,

      genericName: item.genericName,

      category: item.category,

      dosageForm: item.dosageForm,

      strength: item.strength,

      mrp: item.mrp,

      ptr: item.ptr,

      pts: item.pts,

      packSize: item.packSize,

      unitsPerBox: item.unitsPerBox,

      launchDate: this.formatDate(item.launchDate),

      division: item.division,

      manufacturingLicenseNumber:
        item.manufacturingLicenseNumber,

      approvalDate:
        this.formatDate(item.approvalDate),

      promotionPriority:
        item.promotionPriority,

      isActive: item.isActive,

      updatedBy: this.updatedBy,

      imageUrl: item.imageUrl,

      imageFile: null

    });

  }

  // =========================================================
  // 🔷 FILE
  // =========================================================

  onFileChange(event: any) {

    if (event.target.files.length > 0) {

      this.selectedImage =
        event.target.files[0];

    }

  }

  // =========================================================
  // 🔷 UPDATE
  // =========================================================

  updateProduct() {

    this.submitted = true;

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }

    const formValue = this.productForm.value;

    const formData = new FormData();

    Object.keys(formValue).forEach((key: any) => {

      if (
        key !== 'imageFile' &&
        key !== 'imageUrl'
      ) {

        formData.append(
          key,
          formValue[key]
        );

      }

    });

    formData.append(
      'AgencyId',
      this.agencyId
    );

    formData.append(
      'UpdatedBy',
      this.updatedBy
    );

    formData.append(
      'ImageUrl',
      formValue.imageUrl || ''
    );

    if (this.selectedImage) {

      formData.append(
        'imageFile',
        this.selectedImage
      );

    }

    this.productService
      .updateproductdetails(formData)
      .subscribe({

        next: () => {

          alert(
            'Product Updated Successfully'
          );

          this.showEditModal = false;

          this.getProductDetails();

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =========================================================
  // 🔷 DELETE
  // =========================================================

  deleteProduct(item: any) {

    const confirmDelete = confirm(
      'Are you sure want to delete?'
    );

    if (!confirmDelete) return;

    const formData = new FormData();

    formData.append(
      'ProductId',
      item.productId
    );

    formData.append(
      'AgencyId',
      this.agencyId
    );

    formData.append(
      'Name',
      item.name || ''
    );

    formData.append(
      'BrandName',
      item.brandName || ''
    );

    formData.append(
      'GenericName',
      item.genericName || ''
    );

    formData.append(
      'Category',
      item.category || ''
    );

    formData.append(
      'DosageForm',
      item.dosageForm || ''
    );

    formData.append(
      'Strength',
      item.strength || ''
    );

    formData.append(
      'Mrp',
      item.mrp || 0
    );

    formData.append(
      'Ptr',
      item.ptr || 0
    );

    formData.append(
      'Pts',
      item.pts || 0
    );

    formData.append(
      'PackSize',
      item.packSize || ''
    );

    formData.append(
      'UnitsPerBox',
      item.unitsPerBox || 0
    );

    formData.append(
      'LaunchDate',
      item.launchDate
    );

    formData.append(
      'Division',
      item.division || ''
    );

    formData.append(
      'ManufacturingLicenseNumber',
      item.manufacturingLicenseNumber || ''
    );

    formData.append(
      'ApprovalDate',
      item.approvalDate
    );

    formData.append(
      'PromotionPriority',
      item.promotionPriority || 1
    );

    formData.append(
      'IsActive',
      'false'
    );

    formData.append(
      'UpdatedBy',
      this.updatedBy
    );

    formData.append(
      'ImageUrl',
      item.imageUrl
    ); 
    

    this.productService
      .updateproductdetails(formData)
      .subscribe({

        next: () => {

          alert(
            'Product Deleted Successfully'
          );

          this.getProductDetails();

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =========================================================
  // 🔷 CLOSE EDIT
  // =========================================================

  closeEditModal() {

    this.showEditModal = false;

    this.submitted = false;

  }

  // =========================================================
  // 🔷 DATE
  // =========================================================

  formatDate(date: any): string {

    if (!date) return '';

    return new Date(date)
      .toISOString()
      .substring(0, 10);

  }

  // =========================================================
  // 🔷 FORM CONTROL
  // =========================================================

  get f() {

    return this.productForm.controls;

  }

}
