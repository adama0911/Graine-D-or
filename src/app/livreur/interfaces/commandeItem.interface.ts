export interface commandeItem {
    id:number;
    commande: string;
    client: string;
    montantCommande: number;
    montantLivraison: number;
    paiement: number;
    recuperation: number;
    etat: number;
    monnaie: number;
}