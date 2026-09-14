import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  Boxes,
  Percent
} from 'lucide-angular';

import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { ProductService } from '../../services/product.service';

interface DecodedToken {
  userId?: string | number;
  UserId?: string | number;
  id?: string | number;
}

@Component({
  selector: 'app-add-product-master',
  templateUrl: './add-product-master.component.html',
  styleUrl: './add-product-master.component.css'
})
export class AddProductMasterComponent implements OnInit {
  // Lucide Icons
  readonly PackagePlus = PackagePlus;
  readonly ArrowLeft = ArrowLeft;
  readonly Package = Package;
  readonly ClipboardList = ClipboardList;
  readonly DollarSign = DollarSign;
  readonly Box = Box;
  readonly FileCheck = FileCheck;
  readonly TrendingUp = TrendingUp;
  readonly CheckCircle = CheckCircle;
  readonly Save = Save;
  readonly Boxes = Boxes;
  readonly Percent = Percent;

  // Form & State
  productForm!: FormGroup;
  submitted = false;
  isSubmitting = false;

  // State values
  agencyId: string | null = localStorage.getItem('aid');
  createdBy: string | number = 0;
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;



  dosageFormSearch: string = '';
  dosageFormDropdownOpen: boolean = false;

  dosageForms: string[] = [
    // Solid Oral
    'Tablet',
    'Chewable Tablet',
    'Effervescent Tablet',
    'Dispersible Tablet',
    'Soluble Tablet',
    'Sublingual Tablet',
    'Buccal Tablet',
    'Modified Release Tablet',
    'Extended Release Tablet',
    'Enteric Coated Tablet',

    'Capsule',
    'Hard Gelatin Capsule',
    'Soft Gelatin Capsule',
    'Modified Release Capsule',
    'Enteric Coated Capsule',

    'Powder',
    'Granules',
    'Effervescent Granules',
    'Sachet',

    // Liquid Oral
    'Syrup',
    'Dry Syrup',
    'Suspension',
    'Dry Suspension',
    'Oral Solution',
    'Oral Drops',
    'Oral Emulsion',
    'Oral Gel',
    'Elixir',

    // Injectable
    'Injection',
    'Injectable Solution',
    'Injectable Suspension',
    'Infusion',
    'IV Injection',
    'IM Injection',
    'SC Injection',
    'Intravenous Infusion',

    // Topical
    'Cream',
    'Ointment',
    'Gel',
    'Lotion',
    'Liniment',
    'Paste',
    'Topical Solution',
    'Topical Suspension',
    'Topical Powder',
    'Medicated Shampoo',

    // Dermatological
    'Emulsion',
    'Foam',
    'Mousse',
    'Medicated Soap',

    // Eye
    'Eye Drops',
    'Eye Solution',
    'Eye Suspension',
    'Eye Gel',
    'Eye Ointment',
    'Ophthalmic Insert',

    // Ear
    'Ear Drops',
    'Ear Solution',
    'Ear Suspension',

    // Nasal
    'Nasal Drops',
    'Nasal Spray',
    'Nasal Solution',
    'Nasal Gel',
    'Nasal Powder',

    // Respiratory
    'Inhaler',
    'Metered Dose Inhaler',
    'Dry Powder Inhaler',
    'Nebulizer Solution',
    'Respiratory Solution',

    // Rectal
    'Suppository',
    'Rectal Cream',
    'Rectal Ointment',
    'Rectal Gel',
    'Rectal Solution',
    'Enema',

    // Vaginal
    'Vaginal Tablet',
    'Vaginal Capsule',
    'Vaginal Cream',
    'Vaginal Gel',
    'Vaginal Suppository',
    'Vaginal Pessary',

    // Transdermal
    'Transdermal Patch',
    'Medicated Patch',

    // Lozenges
    'Lozenge',
    'Troche',
    'Pastille',

    // Other
    'Mouthwash',
    'Gargle',
    'Dental Gel',
    'Dental Paste',
    'Mouth Gel',
    'Medicated Dressing',
    'Implant',
    'Implantable Tablet',
    'Kit',
    'Other'
  ];


  categorySearch: string = '';
  categoryDropdownOpen: boolean = false;

  categories: string[] = [
    'Analgesic',
    'Antipyretic',
    'Antibiotic',
    'Antiviral',
    'Antifungal',
    'Antiprotozoal',
    'Anthelmintic',
    'Antimalarial',

    'Antacid',
    'Antiulcer',
    'Gastrointestinal',
    'Antiemetic',
    'Laxative',
    'Antidiarrheal',

    'Antihistamine',
    'Antiallergic',
    'Cough & Cold',
    'Expectorant',
    'Antitussive',
    'Decongestant',

    'Cardiovascular',
    'Antihypertensive',
    'Antianginal',
    'Antiarrhythmic',
    'Anticoagulant',
    'Antiplatelet',
    'Lipid Lowering',

    'Antidiabetic',
    'Insulin',
    'Endocrine',
    'Thyroid',

    'CNS',
    'Antidepressant',
    'Antipsychotic',
    'Antiepileptic',
    'Anxiolytic',
    'Sedative',
    'Hypnotic',

    'Respiratory',
    'Bronchodilator',
    'Asthma',
    'COPD',

    'Dermatological',
    'Antiseptic',
    'Disinfectant',
    'Topical',

    'Ophthalmic',
    'Otic',
    'Nasal',

    'Gynecological',
    'Obstetric',

    'Urological',
    'Renal',

    'Musculoskeletal',
    'Anti-inflammatory',
    'Antirheumatic',
    'Muscle Relaxant',

    'Vitamins',
    'Minerals',
    'Nutritional Supplement',
    'Protein Supplement',

    'Hematology',
    'Hematininic',

    'Immunological',
    'Immunosuppressant',

    'Oncology',
    'Anticancer',

    'Antiseptic',
    'Anesthetic',
    'Local Anesthetic',

    'Dental',
    'Oral Care',

    'Pediatric',
    'Veterinary',

    'Herbal',
    'Ayurvedic',
    'Homeopathic',

    'Other'
  ];


  // Dependency Injections
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getUserIdFromToken();
    this.initializeForm();
  }

  // =========================================================
  // 🔷 FORM INITIALIZATION
  // =========================================================
  initializeForm(): void {
    this.productForm = this.fb.group({
      agencyId: [this.agencyId],
      name: ['', Validators.required],
      brandName: ['', Validators.required],
      genericName: ['', Validators.required],
      category: ['', Validators.required],
      dosageForm: ['', Validators.required],
      strength: ['', Validators.required],

      mrp: [0, [Validators.required, Validators.min(0)]],
      ptr: [0, [Validators.required, Validators.min(0)]],
      pts: [0, [Validators.required, Validators.min(0)]],

      taxPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      discountPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],

      packSize: ['', Validators.required],
      unitsPerBox: [1, [Validators.required, Validators.min(1)]],

      // 🟩 mandatory section fields restored
      division: ['', Validators.required],
      manufacturingLicenseNumber: ['', Validators.required],
      approvalDate: ['', Validators.required],

      // 🟥 Marketing Section (ONLY Optional Section)
      launchDate: [''],
      promotionPriority: [1],

      quantity: [0, [Validators.required, Validators.min(0)]],

      createdBy: [this.createdBy],
      imageUrl: [''],
      imageFile: [null, Validators.required]
    });
  }
  // =========================================================
  // 🔷 INPUT HANDLERS
  // =========================================================
  preventNegative(event: KeyboardEvent): void {
    if (['-', 'e', 'E', '+'].includes(event.key)) {
      event.preventDefault();
    }
  }

  // =========================================================
  // 🔷 TOKEN DECODE
  // =========================================================
  getUserIdFromToken(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      this.createdBy = decodedToken?.userId ?? decodedToken?.UserId ?? decodedToken?.id ?? 0;
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }

  // =========================================================
  // 🔷 IMAGE SELECTION
  // =========================================================
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.selectedImage = file;
    this.productForm.patchValue({ imageFile: file });

    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result);
    reader.readAsDataURL(file);
  }

  // =========================================================
  // 🔷 SAVE PRODUCT
  // =========================================================
  saveProduct(): void {
    this.submitted = true;

    if (this.isSubmitting) return;

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

    this.isSubmitting = true;
    const formData = this.buildFormData();

    this.productService
      .addproduct(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product Added Successfully',
            confirmButtonColor: '#16a34a'
          }).then(() => {
            this.router.navigate(['/product-master/product-master-dashboard']);
          });
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Product creation failed:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: err?.error?.message || 'Something went wrong',
            confirmButtonColor: '#dc2626'
          });
        }
      });
  }

  // =========================================================
  // 🔷 FORM DATA BUILDER HELPER
  // =========================================================
  private buildFormData(): FormData {
    const formValue = this.productForm.value;
    const formData = new FormData();

    const fieldMappings: Record<string, any> = {
      AgencyId: this.agencyId,
      Name: formValue.name,
      BrandName: formValue.brandName,
      GenericName: formValue.genericName,
      Category: formValue.category,
      DosageForm: formValue.dosageForm,
      Strength: formValue.strength,
      Mrp: formValue.mrp,
      Ptr: formValue.ptr,
      Pts: formValue.pts,
      TaxPercent: formValue.taxPercent ?? 0,
      DiscountPercent: formValue.discountPercent ?? 0,
      PackSize: formValue.packSize,
      UnitsPerBox: formValue.unitsPerBox,
      LaunchDate: formValue.launchDate,
      Division: formValue.division,
      ManufacturingLicenseNumber: formValue.manufacturingLicenseNumber,
      ApprovalDate: formValue.approvalDate,
      Quantity: formValue.quantity,
      PromotionPriority: formValue.promotionPriority,
      CreatedBy: this.createdBy,
      ImageUrl: formValue.imageUrl?.trim() || 'N/A'
    };

    Object.entries(fieldMappings).forEach(([key, value]) => {
      formData.append(key, value ?? '');
    });

    if (this.selectedImage) {
      formData.append('imageFile', this.selectedImage);
    }

    return formData;
  }

  // =========================================================
  // 🔷 FORM CONTROLS GETTER
  // =========================================================
  get f() {
    return this.productForm.controls;
  }



  filteredDosageForms: string[] = [...this.dosageForms];

  filterDosageForms(): void {
    const search = this.dosageFormSearch.trim().toLowerCase();

    if (!search) {
      this.filteredDosageForms = [...this.dosageForms];
      return;
    }

    this.filteredDosageForms = this.dosageForms.filter(
      dosage => dosage.toLowerCase().includes(search)
    );
  }

  selectDosageForm(dosage: string): void {
    this.productForm.patchValue({
      dosageForm: dosage
    });

    this.dosageFormSearch = dosage;
    this.dosageFormDropdownOpen = false;
  }

  filteredCategories: string[] = [...this.categories];

  filterCategories(): void {
    const search = this.categorySearch.trim().toLowerCase();

    if (!search) {
      this.filteredCategories = [...this.categories];
      return;
    }

    this.filteredCategories = this.categories.filter(
      category => category.toLowerCase().includes(search)
    );
  }

  selectCategory(category: string): void {
    this.productForm.patchValue({
      category: category
    });

    this.categorySearch = category;
    this.categoryDropdownOpen = false;
  }
}