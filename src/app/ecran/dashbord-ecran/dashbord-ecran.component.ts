import { Component, OnInit } from '@angular/core';
import { AdminGeneralService } from 'src/app/services/adminGeneral/admin-general.service';

@Component({
  selector: 'app-dashbord-ecran',
  templateUrl: './dashbord-ecran.component.html',
  styleUrls: ['./dashbord-ecran.component.scss']
})
export class DashbordEcranComponent implements OnInit {

  dd;
  df;
  nbrCommandes = 0;
  soldeGraineDor = 0;
  soldeCompenseBBS = 0;
  loading:boolean = false;
  selected;
  motcle;
  listeSave;
  p;
  audio:any;
 constructor(private _serviceAdmin:AdminGeneralService,) { 
   
  }
  searchAll = () => {
    let value = this.motcle;
    console.log("PASS", { value });
  
    const filterTable = this.listeSave.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
    console.log(this.data)
    this.data = filterTable;
  }
  monnairePrpa(mtt1 ,mtt2){
    console.log(mtt1+" "+mtt2)
    let somme = parseInt(mtt1)+parseInt(mtt2);
    let temp = somme/10000;
    let temp1 = temp.toString().split('.')[0];
    let temp3 = parseInt(temp1) + 1;
    let monnaie = temp3 * 10000;
    return monnaie - somme;
  }
  formateNumClient(arg){
    if(arg.includes("+")){
      return arg.split("+")[1]
    } else{
      return arg
    }
    
  }
  public data = [
  ];
 
  currencyFormat(somme) : String{
    return Number(somme).toLocaleString() ;
  }
  ngOnInit(): void {
   
    this.loading = true;
    console.log(JSON.parse(sessionStorage.getItem('currentUser')).id)
    this.dd = (new Date().toJSON()).split("T")[0]
    this.df = (new Date().toJSON()).split("T")[0]
    let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
    let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
    this._serviceAdmin.getCommande({debut:dateDebut,fin:dateFin}).then(res=>{
      console.log(res);
      if(res.status == 1){
        let d = res.data.reverse()
        this.data = d
        this.listeSave = d
        this.loading = false;
      }else{
        this.loading = false;
      }
      
      
    })
    setInterval(()=>{
      console.log('inside intervalle')
      let d = (new Date().toJSON()).split("T")[0]
      let f = (new Date().toJSON()).split("T")[0]
      let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
      let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
      this._serviceAdmin.getCommande({debut:dateDebut,fin:dateFin}).then(res=>{
        //console.log(res.data);
       
        if(res.status == 1){
          let d = res.data.reverse()
          this.data = d
          this.listeSave = d
          this.loading = false;
          //this.audio = new Audio();
          //this.audio.src ='../../assets/hangouts_message_1.mp3';
          //this.audio.play();
        }else{
          this.loading = false;
        }
        
        
      })
    },10000)

  }
  displayPanier(arg){
    if(arg != null || arg != undefined || arg != ""){
      let panier = JSON.parse(arg);
      let toDisplay = ""
      for(let i of panier){
        toDisplay = toDisplay+" "+i.qte+" "+i.article+" ,"
      }
      return toDisplay
    }else{
      return "";
    }
    
  }
 
  displayDate(date){ 
    if(date != ""){
      return new Date(date).toLocaleString();
    }
    
  }
  displayData(obj,nom){
    if(obj.includes("{")){
      let ob = JSON.parse(obj);
      if(nom =="nom"){
        return ob.nom;
      }
      if(nom =="prenom"){
        return ob.prenom;
      }
          if(nom =="identifiant"){
        return ob.identifiant;
      }
      if(nom =="accesslevel"){
        return ob.accesslevel;
      }
      return "";
    }else{
      return obj;
    }
   
  }
 

}
