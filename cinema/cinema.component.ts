import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  // @ts-ignore
  public villes;public cinemas;
  // @ts-ignore
  public currentVille; public currentCinema;
  // @ts-ignore
  public salles;
  // @ts-ignore
  public projections;
  // @ts-ignore
  public currentProjections;
  private selectedTickets: any;

  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data =>{
        this.villes=data;
      },error=>{
        console.log(error);
      })
  }

  // @ts-ignore
  onGetCinemas(v) {
    this.currentVille=v;
    this.cinemaService.getCinemas(v)
      .subscribe(data =>{
        this.cinemas=data;
      },error=>{
        console.log(error);
      })
  }

  // @ts-ignore
  onGetSalles(c) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data =>{
        this.salles=data;
        // @ts-ignore
        this.salles._embedded.salles.forEach(salles=>{
          // @ts-ignore
          this.cinemaService.getProjections(salle)
            .subscribe(data =>{
              this.projections=data;
            },error=>{
              console.log(error);
            })
        })
      },error=>{
        console.log(error);
      })

  }

  // @ts-ignore
  OnGetTicketsPlaces(p) {
    this.currentProjections=p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data =>{
        this.currentProjections.ticket=data;
        this.selectedTickets=[];
      },error=>{
        console.log(error);
      })
  }
  // @ts-ignore
  OnSelectTickets(t){
    if(!t.selected){
      t.selected=true;
      this.selectedTickets.push(t);
    }
    else{
      t.selected=false;
      this.selectedTickets.slice(this.selectedTickets.indexOf(t), 1);
    }

  }
  // @ts-ignore
  getTicketClass(t){
    let str="btn ticket";
    if(t.reserve==true){
      str+="btn-danger";
    }
    else if(t.selected){
      str+="btn-warning"
    }
    else{
      str+="btn-success"
    }
    return str;
  }
}
// @ts-ignore
onPayTickets(form){
  // @ts-ignore
  let tickets=[];
  // @ts-ignore
  this.selectedTickets.forEach(t=>{
    tickets.push(t.id);
  });
  // @ts-ignore
  form.tickets=tickets;
  // @ts-ignore
  this.cinemaService.payerTickets(form)
    .subscribe(data =>{
      alert("Tickets réservées avec succées!");
      // @ts-ignore
      this.OnGetTicketsPlaces(this.currentProjections);
    },error=>{
      console.log(error);
    })
}
