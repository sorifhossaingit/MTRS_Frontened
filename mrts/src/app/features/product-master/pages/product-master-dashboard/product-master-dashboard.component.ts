// import { Component, OnInit } from '@angular/core';

// import {
//   Package,
//   Plus,
//   Upload,
//   CheckCircle,
//   XCircle,
//   TrendingUp,
//   Eye,
//   Pencil,
//   Trash2,
//   X,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-angular';

// import {
//   FormBuilder,
//   FormGroup,
//   Validators
// } from '@angular/forms';

// import { jwtDecode } from 'jwt-decode';
// import { ProductService } from '../../services/product.service';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-product-master-dashboard',
//   templateUrl: './product-master-dashboard.component.html',
//   styleUrl: './product-master-dashboard.component.css'
// })
// export class ProductMasterDashboardComponent implements OnInit {

//   // =========================================================
//   // 🔷 ICONS
//   // =========================================================

//   Package = Package;
//   Plus = Plus;
//   Upload = Upload;
//   CheckCircle = CheckCircle;
//   XCircle = XCircle;
//   TrendingUp = TrendingUp;
//   Eye = Eye;
//   Pencil = Pencil;
//   Trash2 = Trash2;
//   X = X;
//   ChevronLeft = ChevronLeft;
//   ChevronRight = ChevronRight;

//   constructor(
//     private productService: ProductService,
//     private fb: FormBuilder
//   ) { }

//   // =========================================================
//   // 🔷 STORAGE
//   // =========================================================

//   agencyId: any = localStorage.getItem('aid');

//   updatedBy: any;

//   // =========================================================
//   // 🔷 DASHBOARD
//   // =========================================================

//   totalProducts = 0;
//   activeProducts = 0;
//   inactiveProducts = 0;
//   topProducts: any[] = [];
//   topProduct: any = null;

//   // =========================================================
//   // 🔷 FILTERS
//   // =========================================================

//   name = '';
//   brandName = '';
//   genericName = '';
//   category = '';
//   dosageForm = '';

//   // =========================================================
//   // 🔷 PAGINATION
//   // =========================================================

//   pageNumber = 1;
//   pageSize = 10;
//   totalRecords = 0;
//   totalPages = 0;

//   // =========================================================
//   // 🔷 DATA
//   // =========================================================

//   productList: any[] = [];

//   selectedProduct: any;

//   // =========================================================
//   // 🔷 MODAL
//   // =========================================================

//   showViewModal = false;

//   showEditModal = false;

//   // =========================================================
//   // 🔷 FORM
//   // =========================================================

//   productForm!: FormGroup;

//   submitted = false;

//   selectedImage: any;

//   // =========================================================
//   // 🔷 INIT
//   // =========================================================

//   ngOnInit(): void {

//     this.getUserIdFromToken();

//     this.initializeForm();

//     this.loadProductDashboardSummary();
//     this.getProductDetails();

//   }

//   // =========================================================
//   // 🔷 FORM
//   // =========================================================

//   initializeForm() {

//     this.productForm = this.fb.group({

//       productId: [0],

//       agencyId: [this.agencyId],

//       name: ['', Validators.required],

//       brandName: ['', Validators.required],

//       genericName: ['', Validators.required],

//       category: ['', Validators.required],

//       dosageForm: ['', Validators.required],

//       strength: ['', Validators.required],

//       mrp: [0, Validators.required],

//       ptr: [0, Validators.required],

//       pts: [0, Validators.required],

//       packSize: ['', Validators.required],

//       unitsPerBox: [0, Validators.required],

//       launchDate: ['', Validators.required],

//       division: ['', Validators.required],

//       manufacturingLicenseNumber: ['', Validators.required],

//       approvalDate: ['', Validators.required],

//       promotionPriority: [1],

//       isActive: [true],

//       updatedBy: [0],

//       imageUrl: [''],

//       imageFile: [null]

//     });

//   }

//   // =========================================================
//   // 🔷 TOKEN
//   // =========================================================

//   getUserIdFromToken() {

//     const token = localStorage.getItem('token');

//     if (token) {

//       const decodedToken: any = jwtDecode(token);

//       this.updatedBy =
//         decodedToken?.userId ||
//         decodedToken?.UserId ||
//         decodedToken?.id;

//     }

//   }

//   loadProductDashboardSummary() {

//     this.productService
//       .get_product_dashborad_summery(this.agencyId)
//       .subscribe({

//         next: (res: any) => {

//           this.totalProducts =
//             res.data.totalProducts || 0;

//           this.activeProducts =
//             res.data.activeProducts || 0;

//           this.inactiveProducts =
//             res.data.inactiveProducts || 0;

//           this.topProducts =
//             res.data.topProducts || 0;

//           this.topProduct = this.topProducts[0];

//         },

//         error: (err: any) => {

//           console.log(err);

//         }

//       });

//   }

//   // =========================================================
//   // 🔷 GET PRODUCTS
//   // =========================================================

//   getProductDetails() {

//     const params = {

//       AgencyId: this.agencyId,

//       Name: this.name,

//       BrandName: this.brandName,

//       GenericName: this.genericName,

//       Category: this.category,

//       DosageForm: this.dosageForm,

//       pageNumber: this.pageNumber,

//       pageSize: this.pageSize

//     };

//     this.productService
//       .getproductdetails(params)
//       .subscribe({

//         next: (res: any) => {

//           this.productList = res?.data || [];

//           this.totalRecords = res?.totalCount || 0;

//           this.totalPages = Math.ceil(
//             this.totalRecords / this.pageSize
//           );

//         },

//         error: (err: any) => {

//           console.log(err);

//         }

//       });

//   }

//   // =========================================================
//   // 🔷 FILTER
//   // =========================================================

//   applyFilter() {

//     this.pageNumber = 1;

//     this.getProductDetails();

//   }

//   // =========================================================
//   // 🔷 RESET
//   // =========================================================

//   resetFilter() {

//     this.name = '';
//     this.brandName = '';
//     this.genericName = '';
//     this.category = '';
//     this.dosageForm = '';

//     this.pageNumber = 1;

//     this.getProductDetails();

//   }

//   // =========================================================
//   // 🔷 PAGINATION
//   // =========================================================

//   nextPage() {

//     if (this.pageNumber < this.totalPages) {

//       this.pageNumber++;

//       this.getProductDetails();

//     }

//   }

//   previousPage() {

//     if (this.pageNumber > 1) {

//       this.pageNumber--;

//       this.getProductDetails();

//     }

//   }

//   // =========================================================
//   // 🔷 VIEW
//   // =========================================================

//   viewProduct(item: any) {

//     this.selectedProduct = item;

//     this.showViewModal = true;

//   }

//   closeViewModal() {

//     this.showViewModal = false;

//   }

//   // =========================================================
//   // 🔷 EDIT
//   // =========================================================

//   editProduct(item: any) {

//     this.selectedProduct = item;

//     this.selectedImage = null;

//     this.showEditModal = true;

//     this.productForm.patchValue({

//       productId: item.productId,

//       agencyId: this.agencyId,

//       name: item.name,

//       brandName: item.brandName,

//       genericName: item.genericName,

//       category: item.category,

//       dosageForm: item.dosageForm,

//       strength: item.strength,

//       mrp: item.mrp,

//       ptr: item.ptr,

//       pts: item.pts,

//       packSize: item.packSize,

//       unitsPerBox: item.unitsPerBox,

//       launchDate: this.formatDate(item.launchDate),

//       division: item.division,

//       manufacturingLicenseNumber:
//         item.manufacturingLicenseNumber,

//       approvalDate:
//         this.formatDate(item.approvalDate),

//       promotionPriority:
//         item.promotionPriority,

//       isActive: item.isActive,

//       updatedBy: this.updatedBy,

//       imageUrl: item.imageUrl,

//       imageFile: null

//     });

//   }

//   // =========================================================
//   // 🔷 FILE
//   // =========================================================

//   onFileChange(event: any) {

//     if (event.target.files.length > 0) {

//       this.selectedImage =
//         event.target.files[0];

//     }

//   }

//   // =========================================================
//   // 🔷 UPDATE
//   // =========================================================

//   updateProduct() {

//     this.submitted = true;

//     if (this.productForm.invalid) {

//       this.productForm.markAllAsTouched();

//       Swal.fire({
//         icon: 'warning',
//         title: 'Validation Error',
//         text: 'Please fill all required fields correctly.',
//         confirmButtonColor: '#f59e0b'
//       });

//       return;

//     }

//     const formValue = this.productForm.value;

//     const formData = new FormData();

//     Object.keys(formValue).forEach((key: any) => {

//       if (
//         key !== 'imageFile' &&
//         key !== 'imageUrl'
//       ) {

//         formData.append(
//           key,
//           formValue[key]
//         );

//       }

//     });

//     formData.append(
//       'AgencyId',
//       this.agencyId
//     );

//     formData.append(
//       'UpdatedBy',
//       this.updatedBy
//     );

//     formData.append(
//       'ImageUrl',
//       formValue.imageUrl || ''
//     );

//     if (this.selectedImage) {

//       formData.append(
//         'imageFile',
//         this.selectedImage
//       );

//     }

//     this.productService
//       .updateproductdetails(formData)
//       .subscribe({

//         next: () => {

//           Swal.fire({
//             icon: 'success',
//             title: 'Success',
//             text: 'Product Updated Successfully',
//             confirmButtonColor: '#16a34a'
//           });

//           this.showEditModal = false;

//           this.getProductDetails();
//           this.loadProductDashboardSummary();

//         },

//         error: (err: any) => {

//           console.log(err);

//           Swal.fire({
//             icon: 'error',
//             title: 'Update Failed',
//             text:
//               err?.error?.message ||
//               'Something went wrong while updating the product.',
//             confirmButtonColor: '#dc2626'
//           });

//         }

//       });

//   }

//   // =========================================================
//   // 🔷 DELETE
//   // =========================================================

//   deleteProduct(item: any) {

//     Swal.fire({
//       title: 'Delete Product?',
//       text: `Are you sure you want to delete ${item.name}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Delete',
//       cancelButtonText: 'Cancel',
//       confirmButtonColor: '#dc2626',
//       cancelButtonColor: '#6b7280'
//     }).then((result) => {

//       if (!result.isConfirmed) {
//         return;
//       }

//       const formData = new FormData();

//       formData.append(
//         'ProductId',
//         item.productId
//       );

//       formData.append(
//         'AgencyId',
//         this.agencyId
//       );

//       formData.append(
//         'Name',
//         item.name || ''
//       );

//       formData.append(
//         'BrandName',
//         item.brandName || ''
//       );

//       formData.append(
//         'GenericName',
//         item.genericName || ''
//       );

//       formData.append(
//         'Category',
//         item.category || ''
//       );

//       formData.append(
//         'DosageForm',
//         item.dosageForm || ''
//       );

//       formData.append(
//         'Strength',
//         item.strength || ''
//       );

//       formData.append(
//         'Mrp',
//         item.mrp || 0
//       );

//       formData.append(
//         'Ptr',
//         item.ptr || 0
//       );

//       formData.append(
//         'Pts',
//         item.pts || 0
//       );

//       formData.append(
//         'PackSize',
//         item.packSize || ''
//       );

//       formData.append(
//         'UnitsPerBox',
//         item.unitsPerBox || 0
//       );

//       formData.append(
//         'LaunchDate',
//         item.launchDate
//       );

//       formData.append(
//         'Division',
//         item.division || ''
//       );

//       formData.append(
//         'ManufacturingLicenseNumber',
//         item.manufacturingLicenseNumber || ''
//       );

//       formData.append(
//         'ApprovalDate',
//         item.approvalDate
//       );

//       formData.append(
//         'PromotionPriority',
//         item.promotionPriority || 1
//       );

//       formData.append(
//         'IsActive',
//         'false'
//       );

//       formData.append(
//         'UpdatedBy',
//         this.updatedBy
//       );

//       formData.append(
//         'ImageUrl',
//         item.imageUrl
//       );

//       Swal.fire({
//         title: 'Deleting Product...',
//         text: 'Please wait',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//         didOpen: () => {
//           Swal.showLoading();
//         }
//       });

//       this.productService
//         .updateproductdetails(formData)
//         .subscribe({

//           next: () => {

//             Swal.fire({
//               icon: 'success',
//               title: 'Deleted',
//               text: 'Product Deleted Successfully',
//               confirmButtonColor: '#16a34a'
//             });

//             this.loadProductDashboardSummary();
//             this.getProductDetails();

//           },

//           error: (err: any) => {

//             console.log(err);

//             Swal.fire({
//               icon: 'error',
//               title: 'Delete Failed',
//               text:
//                 err?.error?.message ||
//                 'Something went wrong while deleting the product.',
//               confirmButtonColor: '#dc2626'
//             });

//           }

//         });

//     });

//   }

//   // =========================================================
//   // 🔷 CLOSE EDIT
//   // =========================================================

//   closeEditModal() {

//     this.showEditModal = false;

//     this.submitted = false;

//   }

//   // =========================================================
//   // 🔷 DATE
//   // =========================================================

//   formatDate(date: any): string {

//     if (!date) return '';

//     return new Date(date)
//       .toISOString()
//       .substring(0, 10);

//   }

//   // =========================================================
//   // 🔷 FORM CONTROL
//   // =========================================================

//   get f() {

//     return this.productForm.controls;

//   }

// }




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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

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
  // 🔷 STORAGE & STATE
  // =========================================================

  agencyId: any = localStorage.getItem('aid');
  updatedBy: any;

  totalProducts = 0;
  activeProducts = 0;
  inactiveProducts = 0;
  topProducts: any[] = [];
  topProduct: any = null;

  // Filters
  name = '';
  brandName = '';
  genericName = '';
  category = '';
  dosageForm = '';

  // Pagination
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  // Data & Modals
  productList: any[] = [];
  selectedProduct: any;
  showViewModal = false;
  showEditModal = false;

  // Form & Image Preview
  productForm!: FormGroup;
  submitted = false;
  selectedImage: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null; // 👈 Store new image preview URL

  // =========================================================
  // 🔷 INIT
  // =========================================================

  ngOnInit(): void {
    this.getUserIdFromToken();
    this.initializeForm();
    this.loadProductDashboardSummary();
    this.getProductDetails();
  }

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
      quantity: [0],
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

  loadProductDashboardSummary() {
    this.productService
      .get_product_dashborad_summery(this.agencyId)
      .subscribe({
        next: (res: any) => {
          this.totalProducts = res?.data?.totalProducts || 0;
          this.activeProducts = res?.data?.activeProducts || 0;
          this.inactiveProducts = res?.data?.inactiveProducts || 0;
          this.topProducts = res?.data?.topProducts || [];
          this.topProduct = this.topProducts.length > 0 ? this.topProducts[0] : null;
        },
        error: (err: any) => console.error(err)
      });
  }

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
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        },
        error: (err: any) => console.error(err)
      });
  }

  applyFilter() {
    this.pageNumber = 1;
    this.getProductDetails();
  }

  resetFilter() {
    this.name = '';
    this.brandName = '';
    this.genericName = '';
    this.category = '';
    this.dosageForm = '';
    this.pageNumber = 1;
    this.getProductDetails();
  }

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

  viewProduct(item: any) {
    this.selectedProduct = item;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
  }

  // =========================================================
  // 🔷 EDIT & IMAGE PREVIEW LOGIC
  // =========================================================

  editProduct(item: any) {
    this.selectedProduct = item;
    this.selectedImage = null;
    this.imagePreviewUrl = item.imageUrl || null; // 👈 Show existing product image initially
    this.showEditModal = true;

    this.productForm.patchValue({
      productId: item.productId ?? item.id ?? 0,
      agencyId: this.agencyId,
      name: item.name || '',
      brandName: item.brandName || '',
      genericName: item.genericName || '',
      category: item.category || '',
      dosageForm: item.dosageForm || '',
      strength: item.strength || '',
      mrp: item.mrp || 0,
      ptr: item.ptr || 0,
      pts: item.pts || 0,
      packSize: item.packSize || '',
      unitsPerBox: item.unitsPerBox || 0,
      quantity: item.quantity || 0,
      launchDate: this.formatDate(item.launchDate),
      division: item.division || '',
      manufacturingLicenseNumber: item.manufacturingLicenseNumber || '',
      approvalDate: this.formatDate(item.approvalDate),
      promotionPriority: item.promotionPriority || 1,
      isActive: item.isActive ?? true,
      updatedBy: this.updatedBy,
      imageUrl: item.imageUrl || '',
      imageFile: null
    });
  }

  // 🔷 HANDLE FILE CHANGE AND RENDER PREVIEW
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // Generate a base64 Data URL to preview the newly chosen image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProduct() {
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

    const formValue = this.productForm.value;
    const formData = new FormData();

    Object.keys(formValue).forEach((key: any) => {
      if (key !== 'imageFile' && key !== 'imageUrl') {
        formData.append(key, formValue[key]);
      }
    });

    formData.append('AgencyId', this.agencyId);
    formData.append('UpdatedBy', this.updatedBy);
    formData.append('ImageUrl', formValue.imageUrl || '');

    if (this.selectedImage) {
      formData.append('imageFile', this.selectedImage);
    }

    this.productService
      .updateproductdetails(formData)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product Updated Successfully',
            confirmButtonColor: '#16a34a'
          });

          this.closeEditModal();
          this.getProductDetails();
          this.loadProductDashboardSummary();
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: err?.error?.message || 'Something went wrong while updating the product.',
            confirmButtonColor: '#dc2626'
          });
        }
      });
  }

  deleteProduct(item: any) {
    Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to delete ${item.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (!result.isConfirmed) return;

      const formData = new FormData();
      formData.append('ProductId', item.productId);
      formData.append('AgencyId', this.agencyId);
      formData.append('Name', item.name || '');
      formData.append('BrandName', item.brandName || '');
      formData.append('GenericName', item.genericName || '');
      formData.append('Category', item.category || '');
      formData.append('DosageForm', item.dosageForm || '');
      formData.append('Strength', item.strength || '');
      formData.append('Mrp', item.mrp || 0);
      formData.append('Ptr', item.ptr || 0);
      formData.append('Pts', item.pts || 0);
      formData.append('PackSize', item.packSize || '');
      formData.append('UnitsPerBox', item.unitsPerBox || 0);
      formData.append('LaunchDate', item.launchDate);
      formData.append('Division', item.division || '');
      formData.append('ManufacturingLicenseNumber', item.manufacturingLicenseNumber || '');
      formData.append('ApprovalDate', item.approvalDate);
      formData.append('PromotionPriority', item.promotionPriority || 1);
      formData.append('IsActive', 'false');
      formData.append('UpdatedBy', this.updatedBy);
      formData.append('ImageUrl', item.imageUrl || '');

      Swal.fire({
        title: 'Deleting Product...',
        text: 'Please wait',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading()
      });

      this.productService
        .updateproductdetails(formData)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Product Deleted Successfully',
              confirmButtonColor: '#16a34a'
            });
            this.loadProductDashboardSummary();
            this.getProductDetails();
          },
          error: (err: any) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: err?.error?.message || 'Something went wrong while deleting the product.',
              confirmButtonColor: '#dc2626'
            });
          }
        });
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.submitted = false;
    this.selectedImage = null;
    this.imagePreviewUrl = null; // Clear image preview state on modal close
  }

  formatDate(date: any): string {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  }

  get f() {
    return this.productForm.controls;
  }
}
