export interface commandeItem {
    id:number;
    commande: string;
    designation:string;
    caissier:string;
    vendeuse:string;
    adresse:string;
    livreur: string;
    client: string;
    montantCommande: number;
    montantLivraison: number;
    paiement: number;
    recuperation: number;
    etat: number;
    monnaie: number;
    etatText:string;
}