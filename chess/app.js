var chess = angular.module('chess',['ngRoute']);


chess.config(function($routeProvider){
$routeProvider
  .when('/',{
    templateUrl:'pages/home.htm',
    controller:'homeController'
  });
});

//controllersss
chess.controller('homeController',function($scope,$timeout){
	//$scope.stateArray =[];
	$scope.backIndex=0;
	$scope.mod = true;
	$scope.colorMove = "white";
	$scope.setColorMove = function(clr)
	{
		$scope.colorMove = clr;
	}
	
	$scope.getColorMove = function()
	{
		return $scope.colorMove;
	}
	
	$scope.modify = function()
	{
		//$scope.stateArray.push($scope.config);
		$scope.mod = false;
		var nextColorMove = $scope.getColorMove() == "white" ? "black":"white";
		$scope.setColorMove(nextColorMove)
		$timeout(function(){
				$scope.mod = true;
				$scope.selectedCell = {};
		},0);
		
	}
	$scope.selectedCell = {};
		
	$scope.setSelectedCell = function(row,col,piece,color){
			$scope.selectedCell.row = row;
			$scope.selectedCell.col = col;
			$scope.selectedCell.piece = piece;
			$scope.selectedCell.color = color;
	}
	
	$scope.getSelectedCell = function(){
		return $scope.selectedCell;
	}
	$scope.classFunc = function(row,col){
		var row = parseInt(row)+1;
		var col = parseInt(col)+1
		if(row %2 == 1)
		{
			if(col%2 == 1)
				return "square white"
			else
				return "square black"
		}
		else
		{
			if(col%2 == 1)
				return "square black"
			else
				return "square white"
		}
		
		return "square"
		
	}
	
	$scope.config = 
	{
		1:{clr:"white",pc:"rook"},
		2:{clr:"white",pc:"horse"},
		3:{clr:"white",pc:"bishop"},
		4:{clr:"white",pc:"king"},
		5:{clr:"white",pc:"queen"},
		6:{clr:"white",pc:"bishop"},
		7:{clr:"white",pc:"horse"},
		8:{clr:"white",pc:"rook"},
		9:{clr:"white",pc:"soldier"},
		10:{clr:"white",pc:"soldier"},
		11:{clr:"white",pc:"soldier"},
		12:{clr:"white",pc:"soldier"},
		13:{clr:"white",pc:"soldier"},
		14:{clr:"white",pc:"soldier"},
		15:{clr:"white",pc:"soldier"},
		16:{clr:"white",pc:"soldier"},
		49:{clr:"black",pc:"soldier"},
		50:{clr:"black",pc:"soldier"},
		51:{clr:"black",pc:"soldier"},
		52:{clr:"black",pc:"soldier"},
		53:{clr:"black",pc:"soldier"},
		54:{clr:"black",pc:"soldier"},
		55:{clr:"black",pc:"soldier"},
		56:{clr:"black",pc:"soldier"},
		57:{clr:"black",pc:"rook"},
		58:{clr:"black",pc:"horse"},
		59:{clr:"black",pc:"bishop"},
		60:{clr:"black",pc:"king"},
		61:{clr:"black",pc:"queen"},
		62:{clr:"black",pc:"bishop"},
		63:{clr:"black",pc:"horse"},
		64:{clr:"black",pc:"rook"}
	}
	
});

chess.directive("boardRow",function(){
	return {
		restrict:'E',
		replace:true,
		templateUrl:"directives/board-row.html",		
		scope:{
			index:'@',
			configParams:'=',
			modifyFunc:'&',
			classFunction:'&'
		},
		link:function(){
			console.log("post linking");
		}
	}
});

chess.directive("boardSquare",function(){
	return {
		restrict:'E',
		replace:true,
		templateUrl:"directives/board-square.html",
		scope:{
			rowindex:'@',
			colindex:'@',
			configParamsSqr:'=',
			modifyFuncSqr:'&',
			classFuncSqr:'&'
		},
		controller:function($scope){
			$scope.squareController = function(evt){
				var parentScope = this.$parent.$parent.$parent;
				var elem = angular.element(evt.currentTarget);
				var piece = elem.attr("piece");
				var color = elem.attr("color");
				var rowno = parseInt(elem.attr("row")) +1;
				var colno = parseInt(elem.attr("col")) +1;
				var cellno = (rowno-1)*8 + colno;
				var configs = parentScope.config;
				var prevSelectedCell = parentScope.getSelectedCell();
				if(piece != null && parentScope.getColorMove() != color && Object.keys(prevSelectedCell).length == 0)
				{
					alert(parentScope.getColorMove() + " turn");
					return;
				}
				var isMoveMade = null; // changes when the player plays a move , else its null
				if(Object.keys(prevSelectedCell).length > 0) //did he select any other piece
				{
					var prevselPiece = prevSelectedCell.piece;
					var prevselPieceColor = prevSelectedCell.color;
					if(piece != null && parentScope.getColorMove() != prevselPieceColor)
					{
						alert(parentScope.getColorMove() + " turn");
						return;
					}
					prevrowno = prevSelectedCell.row;
					prevcolno = prevSelectedCell.col;
					var prevCellNo =  (prevSelectedCell.row-1)*8 + prevSelectedCell.col;
					if(prevCellNo == cellno)
						return true;
					var validkeys =[];
					var tempObj = {};
					switch(prevselPiece){
						case "king":
							if(color == prevselPieceColor){
								alert("invalid move");
								isMoveMade=null;
							}
							else
							{
								var isValid = false;
								var rownoDiff = Math.abs(rowno - prevrowno);
								var colnoDiff = Math.abs(colno - prevcolno);
								if((rownoDiff == 1 || rownoDiff == 0) && (colnoDiff == 1 || colnoDiff == 0))
									isValid = true;
								if(isValid == true)
								{
									//see if where the player wants to put is a white colr piece or black color piece
									// then the piece can cut the other piece  
									
									tempObj = configs[prevCellNo];
									delete configs[prevCellNo];
									delete configs[cellno];
									configs[cellno] = tempObj;
									isMoveMade = true;
									//change position
									
								}
								else
								{
									alert("invalid move");
									isMoveMade=false;
								}
							}
							
							
							break;
						case "queen":
							if(color == prevselPieceColor){
								alert("invalid move");
								isMoveMade=null;
							}
							else
							{
								var isValid = false;
								var rownoDiff = Math.abs(rowno - prevrowno);
								var colnoDiff = Math.abs(colno - prevcolno);
								if(rownoDiff == colnoDiff)
									isValid = true;
								if(isValid == true)
								{
									//see if where the player wants to put is a white colr piece or black color piece
									
									 // then the piece can cut the other piece  
									
										//look if any other piece is blocking its way
									var btwnCellNo;
									var right = 1; //towards right
									var down = 1; // towards down
									if(rowno > prevrowno)
									{
										if(colno > prevcolno)
										{
											right=1;
											down=1;
										}
										else
										{
											right=-1;
											down=1;
										}
									}
									else
									{
										if(colno > prevcolno)
										{
											right=1;
											down=-1;
										}
										else
										{
											right=-1;
											down=-1;
										}
									}
										
									for(var i =1;i<rownoDiff;i++)
									{
										btwnCellNo = (prevrowno-1+(i*down))*8+(prevcolno+(i*right));
										if(configs[btwnCellNo] != null){
											alert("invalid move");
											isMoveMade=false;
											isValid = false;
											break;
										}
									}
									if(isValid)
									{
										tempObj = configs[prevCellNo];
										delete configs[prevCellNo];
										delete configs[cellno];
										configs[cellno] = tempObj;
										isMoveMade = true;
									}
								
								}
								else
								{
									if(prevrowno == rowno || prevcolno  == colno)
									{
										isValid = true;
									}
									if(isValid == true)
									{
										//see if where the player wants to put is a white colr piece or black color piece
										
										 // then the piece can cut the other piece  
										
											//look if any other piece is blocking its way
										var btwnCellNo;
										
										if(cellno > prevCellNo)
										{
											start = prevCellNo;
											end = cellno;
										}
										else
										{
											start = cellno;
											end = prevCellNo;
										}
										var index;
										if(prevcolno == colno){
											index = 8;
											start = start+8;
										}
										else
										{
											start++;
											index=1;
										}
										for(;start<end;start=start+index)
										{
											if(configs[start] != null)
											{
												isValid = false;
												alert("invalid move");
												isMoveMade=false;
												break;
											}
										}
										if(isValid == true)
										{
											tempObj = configs[prevCellNo];
											delete configs[prevCellNo];
											delete configs[cellno];
											configs[cellno] = tempObj;
											isMoveMade = true;
										}
										
									}
									else
									{
										alert("invalid move");
										isMoveMade=false;
									}
								}
							}
							
							
							break;
						case "bishop":
							if(color == prevselPieceColor){
								alert("invalid move");
								isMoveMade=null;
							}
							else
							{
									var isValid = false;
								var rownoDiff = Math.abs(rowno - prevrowno);
								var colnoDiff = Math.abs(colno - prevcolno);
								if(rownoDiff == colnoDiff)
									isValid = true;
								if(isValid == true)
								{
								//see if where the player wants to put is a white colr piece or black color piece
								
								 // then the piece can cut the other piece  
								
									//look if any other piece is blocking its way
									var btwnCellNo;
									var right = 1; //towards right
									var down = 1; // towards down
									if(rowno > prevrowno)
									{
										if(colno > prevcolno)
										{
											right=1;
											down=1;
										}
										else
										{
											right=-1;
											down=1;
										}
									}
									else
									{
										if(colno > prevcolno)
										{
											right=1;
											down=-1;
										}
										else
										{
											right=-1;
											down=-1;
										}
									}
										
									for(var i =1;i<rownoDiff;i++)
									{
										btwnCellNo = (prevrowno-1+(i*down))*8+(prevcolno+(i*right));
										if(configs[btwnCellNo] != null){
											alert("invalid move");
											isMoveMade=false;
											isValid = false;
											break;
										}
									}
									if(isValid)
									{
										tempObj = configs[prevCellNo];
										delete configs[prevCellNo];
										delete configs[cellno];
										configs[cellno] = tempObj;
										isMoveMade = true;
									}
								
								}
								else
									{
										alert("invalid move");
										isMoveMade=false;
									}
							}
							
							break;
						case "horse":
							if(color == prevselPieceColor){
								alert("invalid move");
								isMoveMade=null;
							}
							else
							{
								validKeys =[[1,2],[-1,2],[1,-2],[-1,-2],[2,1],[-2,1],[2,-1],[-2,-1]];
								var isValid = false;
								for(var i = 0;i<validKeys.length;i++)
								{
									if(((prevrowno+validKeys[i][0]) == rowno) && ((prevcolno+validKeys[i][1]) == colno))
									{
										isValid = true;
										break;
									}
								}
								if(isValid == true)
								{
									//see if where the player wants to put is a white colr piece or black color piece
									
									// then the piece can cut the other piece  
									
										//change position
										tempObj = configs[prevCellNo];
										delete configs[prevCellNo];
										delete configs[cellno];
										configs[cellno] = tempObj;
										isMoveMade = true;
									
								}
								else
								{
									alert("invalid move");
									isMoveMade=false;
								}
							}
							
							break;
						case "rook":
						
							if(color == prevselPieceColor){
								alert("invalid move");
								isMoveMade=null;
							}
							else
							{
								var isValid = false;
								if(prevrowno == rowno || prevcolno  == colno)
								{
									isValid = true;
								}
								if(isValid == true)
								{
									//see if where the player wants to put is a white colr piece or black color piece
									
									 // then the piece can cut the other piece  
									
										//look if any other piece is blocking its way
									var btwnCellNo;
									
									if(cellno > prevCellNo)
									{
										start = prevCellNo;
										end = cellno;
									}
									else
									{
										start = cellno;
										end = prevCellNo;

									}
									var index;
									if(prevcolno == colno){
										index = 8;
										start = start+8;
									}
									else
									{
										start++;
										index=1;
									}
									for(;start<end;start=start+index)
									{
										if(configs[start] != null)
										{
											isValid = false;
											alert("invalid move");
											isMoveMade=false;
											break;
										}
									}
									if(isValid == true)
									{
										tempObj = configs[prevCellNo];
										delete configs[prevCellNo];
										delete configs[cellno];
										configs[cellno] = tempObj;
										isMoveMade = true;
									}
									
								}
								else
								{
									alert("invalid move");
									isMoveMade=false;
								}
							}
							
					
							break;
						case "soldier":
							var isValid = false;
							var index = 1;
							if(color == prevselPieceColor){
								alert("invalid move");
								isMoveMade=null;
							}
							else
							{
								if(prevselPieceColor == "black")
									index = -1;
								if(rowno == prevrowno + index && prevcolno == colno && piece == null)
									isValid = true;
								else if((rowno == (prevrowno + index)) && ((prevcolno == (colno+1)) || (prevcolno == (colno-1))) && piece != null && color != prevselPieceColor){
									isValid = true;
								}
								if(isValid == true)
								{
									//valid move
									tempObj = configs[prevCellNo];
									delete configs[prevCellNo];
									delete configs[cellno];
									configs[cellno] = tempObj;
									isMoveMade = true;
								}
								else
								{
									alert("invalid move");
									isMoveMade=false;
								}
							}										
							
						default:
							break;
					}
				}
				else
				{
					
				}
				if(isMoveMade != false)
				{
					if(piece != null)
						parentScope.setSelectedCell(rowno,colno,piece,color);
					var selectedElemCls = document.getElementById("chessboard").getElementsByClassName("selected");
					if(selectedElemCls.length > 0)
					{
						selectedElemCls = angular.element(selectedElemCls[0]);
						selectedElemCls.removeClass("selected");
					}
					elem.addClass("selected");
				}
				
				if(isMoveMade == true){
					//$scope.$apply(function(){
						$scope.modifyFuncSqr();
					//});
				}
					
			}
		},
		link:function(scope,elem,attrs)
		{
			var rowno = parseInt(scope.rowindex)+1;
			var colno = parseInt(scope.colindex)+1;
			var configs = scope.configParamsSqr;
			var cell = ((rowno-1)*8 + colno);
			var piece,colr;
			if(configs[cell] != null)
			{
				piece = configs[cell].pc;
				colr = configs[cell].clr;
				switch(piece)
				{
					case "king":
						elem.append("<div class=king-"+colr+">"+"</div>");
						elem.attr("piece","king");
						elem.attr("color",colr);
						break;
					case "queen":
						elem.append("<div class=queen-"+colr+">"+"</div>");
						elem.attr("piece","queen");
						elem.attr("color",colr);
						break;
					case "bishop":
						elem.append("<div class=bishop-"+colr+">"+"</div>");
						elem.attr("piece","bishop");
						elem.attr("color",colr);
						break;
					case "horse":
						elem.append("<div class=horse-"+colr+">"+"</div>");
						elem.attr("piece","horse");
						elem.attr("color",colr);
						break;
					case "rook":
						elem.append("<div class=rook-"+colr+">"+"</div>");
						elem.attr("piece","rook");
						elem.attr("color",colr);
						break;
					case "soldier":;
						elem.append("<div class=soldier-"+colr+">"+"</div>");
						elem.attr("piece","soldier");
						elem.attr("color",colr);
						break;
					case "blank":
						elem.append("<div background='blank.png'></div>");
						elem.attr("piece","blank");
						elem.attr("color",colr);
						break;
					default:
						elem.append("<div background='blank.png'></div>");
						elem.attr("piece","blank");
						elem.attr("color",colr);
						break;
				}
				
			}
		}
	}
});
