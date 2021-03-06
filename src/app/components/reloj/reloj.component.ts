import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { DataLocalService } from '../../services/data-local.service';
@Component({
  selector: 'app-reloj',
  templateUrl: './reloj.component.html',
  styleUrls: ['./reloj.component.scss'],
})
export class RelojComponent implements OnInit {
  timer: number;
  cambio;
  equipos;
  time :BehaviorSubject<string>=new BehaviorSubject('00:00');
  intervalo;
  constructor(private storage: Storage,private router: Router,private datalocal: DataLocalService) {
   }
   async iniciar(duracion:number){
   clearInterval(this.intervalo)
    this.timer=duracion*60;
    this.intervalo=setInterval(()=>{
      this.actualizartiempo();
    },1000);
  }
  detenertiempo(){
    clearInterval(this.intervalo);
    this.time.next('00:00')
  }
  public disabled = false;
  public action() {
    this.disabled = !this.disabled;
  }
  async fallo(){
    await this.storage.get('equipo').then(recv=>{
      this.equipos=recv;
      console.log('equipos',this.equipos);
    });
    await this.storage.get('jugando').then(otro=>{

      if(this.equipos[0].equipo===otro){
        this.datalocal.cambiar(this.equipos[1].equipo);
        // this.storage.set('jugando', this.equipos[1]);
        // this.cambio=this.equipos[1].equipo;
      }if(this.equipos[1].equipo===otro){
        // this.storage.set('jugando', this.equipos[0]);
        // // this.cambio=this.equipos[0].equipo;
        this.datalocal.cambiar(this.equipos[0].equipo);

      }
      console.log(this.equipos[0].equipo, '=', otro);
      console.log(this.equipos[1].equipo, '=', otro);

    });
    
    this.router.navigate(['/lanzar-dado']);

  }
  async cambiar(equipo:any){
    await this.storage.set('jugando', equipo);
    console.log('cambiar',equipo);
  }
  actualizartiempo(){
    let minutos :any=this.timer/60;
    let segundos :any=this.timer % 60;
    minutos =String('0'+Math.floor(minutos)).slice(-2);
    segundos=String('0'+Math.floor(segundos)).slice(-2);

    const text=minutos+":"+segundos;
    this.time.next(text);
    --this.timer;
    if(this.timer<=0){
      this.detenertiempo()
      console.log(this.timer);
      this.fallo()
    }
  }
  
  async ngOnInit() {
    await this.storage.get('temporizador').then((val) => { 
      let va =Number(val);
      console.log(va);  
      this.iniciar(va); 
    });
    
  }
  

}
