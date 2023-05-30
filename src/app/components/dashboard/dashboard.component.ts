import { Variable } from "@angular/compiler/src/render3/r3_ast";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Chamado } from "src/app/models/chamado";
import { ChamadoService } from "src/app/services/chamado.service";
import { ClienteService } from "src/app/services/cliente.service";
import { TecnicoService } from "src/app/services/tecnico.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  ELEMENT_DATA: Chamado[] = [];
  previous_ELEMENT_DATA: Chamado[] = []; // Estado anterior do array de dados

  displayedColumns: string[] = [
    "id",
    "titulo",
    "cliente",
    "tecnico",
    "dataAbertura",
    "prioridade",
    "status",
  ];

  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: ChamadoService,
    
  ) {
    this.ELEMENT_DATA = [];
    this.previous_ELEMENT_DATA = [];
  }

  ngOnInit(): void {
    this.findEncerradasUpdateTable();

    setInterval(() => {
      this.findEncerradasUpdateTable();
    }, 2000);
  }

  findEncerradasUpdateTable(){
    const newData = this.ELEMENT_DATA = [];
    const hasNewItems = this.checkForNewItems(newData, this.previous_ELEMENT_DATA)

    this.service.findAll().subscribe((previous_ELEMENT_DATA) => {
      previous_ELEMENT_DATA.forEach((x) => {
        if (x.status != "3") {
          this.ELEMENT_DATA.push(x);
        }
       
        if(hasNewItems){
          this.ELEMENT_DATA = newData;
          this.previous_ELEMENT_DATA = newData;
        }
       
        this.dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  checkForNewItems(newData: any[], previous_ELEMENT_DATA: any[]): boolean {
    // Verifica se há novos itens comparando o tamanho dos arrays
    return newData.length > previous_ELEMENT_DATA.length;
  }

  retornaStatus(status: any): String {
    switch (status) {
      case 0:
        return "AGUARDANDO_ATENDIMENTO";
        break;
      case 1:
        return "EM_ATENDIMENTO";
        break;
      case 2:
        return "PAUSADO";
        break;
      case 3:
        return "ENCERRADO";
        break;
      default:
        return "ENCERRADO";
        break;
    }
  }
  retornaPrioridade(prioridade: any): string {
    switch (prioridade) {
      case 0:
        return "BAIXA";
        break;
      case 1:
        return "MEDIA";
        break;
      case 2:
        return "ALTA";
        break;
    }
    return "ALTA";
  }

  
  prioridadeColor(x: any) {
    if (x == "0") {
      return "BAIXA";
    } else if (x == "1") {
      return "MEDIA";
    } else {
      return "ALTA";
    }
  }
}
