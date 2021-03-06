import { Component, OnInit, Inject } from '@angular/core';
import { RequestService } from '../request.service';
import { GameState } from './models/GameState.model';
import { Location } from './models/Location.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  color: string;
  rowVals: number[];
  colVals: string[];
  boardLoaded: boolean;
  blank = "&#160"; // If use empty string div doesn't render
  gameState: GameState;
  selectedPiece: Location;
  selectedPieceMoves: Location[];

  constructor(private requestService: RequestService, private snackbar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.boardLoaded = false;
    const blank = this.blank;
    this.color = this.requestService.getAssignedColor();
    this.rowVals = [8, 7, 6, 5, 4, 3, 2, 1];
    this.colVals = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    if (this.color !== "white") {
      this.rowVals = this.rowVals.reverse();
      this.colVals = this.colVals.reverse();
    }
    this.requestService.sync().subscribe(res => {
      this.gameState = new GameState(res.GameState.board);
      this.boardLoaded = true;
    });
    this.selectedPiece = null;
    this.selectedPieceMoves = [];
  }

  getSquareBackground(row: number, col: string): string {
    let classString = "square";
    if (row % 2 === 0) {
      if (['a', 'c', 'e', 'g'].includes(col)) {
        classString += " white";
      } else {
        classString += " black";
      }
    } else {
      if (['a', 'c', 'e', 'g'].includes(col)) {
        classString += " black";
      } else {
        classString += " white";
      }
    }
    if (this.shouldBeHighlighted(new Location(row, col))) {
      classString += " highlighted";
    }
    return classString;
  }

  private shouldBeHighlighted(location: Location): boolean {
    let returnVal = false;
    if (this.selectedPiece != null && this.selectedPiece.isEqual(location)) {
      returnVal = true;
    }
    this.selectedPieceMoves.forEach(move => {
      if (move.isEqual(location)) {
        returnVal = true;
        return;
      }
    });
    return returnVal;
  }

  getInLocation(row: number, col: string): string {
    return this.gameState.inLocationDisplay(new Location(row, col));
  }

  onClickSquare(row: number, col: string) {
    const clickedLocation = new Location(row, col);
    if (this.selectedPiece == null) {
      // Then we have yet to select a piece

      if (this.gameState.isEmpty(clickedLocation)) {
        return;
      }

      this.selectedPiece = clickedLocation;
      this.requestService.getMoves(clickedLocation).subscribe(res => {
        if (res.status === "Success") {
          res.moves.forEach(move => {
            const moveObject = new Location(8 - move.row, String.fromCharCode(move.col + 97));
            this.selectedPieceMoves.push(moveObject);
          });
        } else { // if (res.status === "Invalid")
          this.openSnackBar(res.status + ": " + res.msg, 5);
          this.selectedPiece = null;
          this.selectedPieceMoves = [];
        }
      });
    } else {
      // Piece has already been selected - if in selected piece array make move
      if (this.selectedPieceMoves.length < 1) {
        // If no pieces just unselect
        this.selectedPiece = null;
      } else {
        this.selectedPieceMoves.forEach(potentialMove => {
          if (clickedLocation.isEqual(this.selectedPiece)) {
            // If user just clicks back on selected piece just unselect all
            this.selectedPiece = null;
            this.selectedPieceMoves = [];
            return;
          }
          if (clickedLocation.isEqual(potentialMove)) {
            this.moveSelectedPiece(clickedLocation);
            return;
          }
        });
      }
    }
  }

  private moveSelectedPiece(location: Location) {
    this.requestService.sendMove(this.selectedPiece, location).subscribe(res => {
      if (res.status === "Success" || res.status === "SuccessCheck") {
        this.gameState.move(this.selectedPiece, location);
        this.selectedPiece = null;
        this.selectedPieceMoves = [];
      } else if (res.status === "WhiteWin" || res.status === "BlackWin" || res.status === "Stalemate") {
        this.requestService.resetGame();
        this.openSnackBar(res.status, 5);
      } else if (res.status === "Invalid") {
        this.openSnackBar(res.msg, 5);
        this.selectedPiece = null;
        this.selectedPieceMoves = [];
      } else if (res.status === "PromotionRequired") {

        const dialogRef = this.dialog.open(PromotionDialogComponent, {
          width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
          this.requestService.sendMove(this.selectedPiece, location, result).subscribe(res => {
            this.gameState.move(this.selectedPiece, location);
            this.selectedPiece = null;
            this.selectedPieceMoves = [];
            this.onSync();
          });
        });
      } else {
        console.log("Unknown response status: " + res.status);
        console.log(res);
      }
    });
  }

  private openSnackBar(message: string, numSeconds: number) {
    this.snackbar.open(message, "Dismiss", {
      duration: numSeconds * 1000,
    });
  }

  onRestart() {
    this.requestService.restart().subscribe(res => {
      this.openSnackBar("Restarting game", 3);
      this.onSync();
    });
  }

  onResign() {
    this.requestService.resign().subscribe(res => {
      this.openSnackBar("You lose", 5);
    });
  }

  onSync() {
    this.requestService.sync().subscribe(res => {
      this.gameState.updateState(res.GameState.board);
    });
  }
}

@Component({
  selector: 'app-promotion-dialog',
  templateUrl: 'promotion-dialog.html',
})

export class PromotionDialogComponent {
  promotion: string;

  constructor(public dialogRef: MatDialogRef<PromotionDialogComponent>) {
    this.promotion = "Queen";
  }

  onSelect(): void {
    this.dialogRef.close();
  }
}
