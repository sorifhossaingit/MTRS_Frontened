import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Package, Plus, Search, RefreshCw, Pencil, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-angular';
import Swal from 'sweetalert2';
import { StockistService } from '../../services/stockist.service';

export interface PersonalProduct {
  personalProductId?: number;
  productUuid?: string;
  agencyId?: number;
  stockistId?: number;
  name: string;
  brandName: string;
  genericName?: string;
  category: string;
  dosageForm?: string;
  strength?: string;
  mrp: number;
  ptr?: number;
  pts?: number;
  packSize?: string;
  unitsPerBox?: number;
  sellingPrice?: number;
  discountPercent?: number;
  quantity?: number;
  division?: string;
  manufacturingLicenseNumber?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-stockiest-personalproduct-dashboard',
  templateUrl: './stockiest-personalproduct-dashboard.component.html',
  styleUrl: './stockiest-personalproduct-dashboard.component.css'
})
export class StockiestPersonalproductDashboardComponent implements OnInit {
  Package = Package;
  Plus = Plus;
  Search = Search;
  RefreshCw = RefreshCw;
  Pencil = Pencil;
  Trash2 = Trash2;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;
  ImageIcon = ImageIcon;

  filterForm!: FormGroup;
  productForm!: FormGroup;

  products: PersonalProduct[] = [];
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  showModal = false;

  // File Upload Preview
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  // Pagination
  pageNumber = 1;
  pageSize = 12;
  totalRecords = 0;
  totalPages = 0;

  constructor(
    private fb: FormBuilder,
    private stockistService: StockistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.getProducts();
  }

  private initForms(): void {
    // Filter Form
    this.filterForm = this.fb.group({
      name: [''],
      brandName: [''],
      category: ['']
    });

    // Create / Edit Product Form
    this.productForm = this.fb.group({
      productId: [0],
      name: ['', Validators.required],
      brandName: [''],
      genericName: [''],
      category: [''],
      dosageForm: [''],
      strength: [''],
      mrp: [0, [Validators.required, Validators.min(0)]],
      ptr: [0],
      pts: [0],
      packSize: [''],
      unitsPerBox: [1],
      sellingPrice: [0],
      discountPercent: [0],
      quantity: [0],
      division: [''],
      manufacturingLicenseNumber: [''],
      imageUrl: ['']
    });
  }

  getProducts(): void {
    this.isLoading = true;

    const payload = {
      agencyId: Number(localStorage.getItem('aid')),
      createdBy: Number(localStorage.getItem('mid')),
      name: this.filterForm.value.name?.trim() || null,
      brandName: this.filterForm.value.brandName?.trim() || null,
      genericName: null,
      category: this.filterForm.value.category?.trim() || null,
      dosageForm: null,
      isActive: true,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.stockistService.list_stockiest_personal_product(payload).subscribe({
      next: (res: any) => {
        this.products = res.data || res.items || res || [];
        this.pageNumber = res.pageNumber || this.pageNumber;
        this.pageSize = res.pageSize || this.pageSize;
        this.totalRecords = res.totalCount || res.totalRecords || this.products.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error Loading Products',
          text: err?.error?.message || 'Failed to fetch personal products list.'
        });
      }
    });
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.getProducts();
  }

  resetFilters(): void {
    this.filterForm.reset({
      name: '',
      brandName: '',
      category: ''
    });
    this.pageNumber = 1;
    this.getProducts();
  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getProducts();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getProducts();
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedFile = null;
    this.imagePreviewUrl = null;

    // Ensure pricing and stock controls are enabled in create mode
    this.setPricingFieldsState(false);

    this.productForm.reset({
      productId: 0,
      name: '',
      brandName: '',
      genericName: '',
      category: '',
      dosageForm: '',
      strength: '',
      mrp: 0,
      ptr: 0,
      pts: 0,
      packSize: '',
      unitsPerBox: 1,
      sellingPrice: 0,
      discountPercent: 0,
      quantity: 0,
      division: '',
      manufacturingLicenseNumber: '',
      imageUrl: ''
    });
    this.showModal = true;
  }

  openEditModal(product: PersonalProduct): void {
    this.isEditMode = true;
    this.selectedFile = null;
    this.imagePreviewUrl = product.imageUrl || null;

    // Temporarily enable controls so patchValue writes cleanly
    this.setPricingFieldsState(false);

    // Patch product values including primary key
    this.productForm.patchValue({
      productId: product.personalProductId || 0,
      name: product.name,
      brandName: product.brandName,
      genericName: product.genericName,
      category: product.category,
      dosageForm: product.dosageForm,
      strength: product.strength,
      mrp: product.mrp,
      ptr: product.ptr,
      pts: product.pts,
      packSize: product.packSize,
      unitsPerBox: product.unitsPerBox,
      sellingPrice: product.sellingPrice,
      discountPercent: product.discountPercent,
      quantity: product.quantity,
      division: product.division,
      manufacturingLicenseNumber: product.manufacturingLicenseNumber,
      imageUrl: product.imageUrl
    });

    // Disable pricing and inventory controls for edit mode
    this.setPricingFieldsState(true);

    this.showModal = true;
  }

  /**
   * Helper to switch enabled/disabled state of stock and pricing controls
   */
  private setPricingFieldsState(disable: boolean): void {
    const pricingFields = ['unitsPerBox', 'mrp', 'ptr', 'pts', 'sellingPrice', 'discountPercent', 'quantity'];
    pricingFields.forEach(field => {
      const control = this.productForm.get(field);
      if (control) {
        disable ? control.disable() : control.enable();
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();

    // getRawValue() ensures disabled form controls are included in the payload
    const formVal = this.productForm.getRawValue();

    // 1. Audit & Primary Key Payload
    if (this.isEditMode) {
      formData.append('ProductId', String(formVal.productId || 0));
      formData.append('UpdatedBy', String(localStorage.getItem('mid') || '0'));
    } else {
      formData.append('AgencyId', String(localStorage.getItem('aid') || '0'));
      formData.append('StockistId', String(localStorage.getItem('mid') || '0'));
      formData.append('CreatedBy', String(localStorage.getItem('mid') || '0'));
    }

    // 2. Product Fields
    formData.append('Name', formVal.name || '');
    formData.append('BrandName', formVal.brandName || '');
    formData.append('GenericName', formVal.genericName || '');
    formData.append('Category', formVal.category || '');
    formData.append('DosageForm', formVal.dosageForm || '');
    formData.append('Strength', formVal.strength || '');
    formData.append('Mrp', String(formVal.mrp || 0));
    formData.append('Ptr', String(formVal.ptr || 0));
    formData.append('Pts', String(formVal.pts || 0));
    formData.append('PackSize', formVal.packSize || '');
    formData.append('UnitsPerBox', String(formVal.unitsPerBox || 1));
    formData.append('SellingPrice', String(formVal.sellingPrice || 0));
    formData.append('DiscountPercent', String(formVal.discountPercent || 0));
    formData.append('Quantity', String(formVal.quantity || 0));
    formData.append('Division', formVal.division || '');
    formData.append('ManufacturingLicenseNumber', formVal.manufacturingLicenseNumber || '');

    // 3. Image URL Handling
    const imageUrlValue = formVal.imageUrl?.trim() || 'N/A';
    formData.append('ImageUrl', imageUrlValue);

    // 4. File Attachment
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    // 5. Submit Payload
    const request$ = this.isEditMode 
      ? this.stockistService.update_personal_product(formData)
      : this.stockistService.create_personal_product(formData);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Product Updated' : 'Product Created',
          timer: 1500,
          showConfirmButton: false
        });
        this.getProducts();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Validation / Operation Error',
          text: err?.error?.title || err?.error?.message || 'An error occurred while saving the product.'
        });
      }
    });
  }
}