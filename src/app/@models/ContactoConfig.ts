export class ContactoConfig {
  id: number;
  correo: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  created_at: string;
  updated_at: string;

  constructor(data: any) {
    this.id = data.id ?? 0;
    this.correo = data.correo ?? '';
    this.whatsapp = data.whatsapp ?? '';
    this.facebook = data.facebook ?? '';
    this.instagram = data.instagram ?? '';
    this.tiktok = data.tiktok ?? '';
    this.created_at = data.created_at ?? '';
    this.updated_at = data.updated_at ?? '';
  }

  get whatsappUrl(): string {
    return this.whatsapp ? `https://wa.me/${this.whatsapp.replace(/\D/g, '')}` : '';
  }
}
