# 037 Sudoku-Solver

difficulty: Hard

<style>
        section pre{
          background-color: #eee;
          border: 1px solid #ddd;
          padding:10px;
          border-radius: 5px;
        }
      </style>
<section>
<div><p>Write a program to solve a Sudoku puzzle by filling the empty cells.</p>
<p>A&nbsp;sudoku solution must satisfy <strong>all of&nbsp;the following rules</strong>:</p>
<ol>
	<li>Each of the digits&nbsp;<code>1-9</code> must occur exactly&nbsp;once in each row.</li>
	<li>Each of the digits&nbsp;<code>1-9</code>&nbsp;must occur&nbsp;exactly once in each column.</li>
	<li>Each of the the digits&nbsp;<code>1-9</code> must occur exactly once in each of the 9 <code>3x3</code> sub-boxes of the grid.</li>
</ol>
<p>Empty cells are indicated by the character <code>'.'</code>.</p>
<p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Sudoku-by-L2G-20050714.svg/250px-Sudoku-by-L2G-20050714.svg.png" style="height:250px; width:250px"><br>
<small>A sudoku puzzle...</small></p>
<p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Sudoku-by-L2G-20050714_solution.svg/250px-Sudoku-by-L2G-20050714_solution.svg.png" style="height:250px; width:250px"><br>
<small>...and its solution numbers marked in red.</small></p>
<p><strong>Note:</strong></p>
<ul>
	<li>The given board&nbsp;contain only digits <code>1-9</code> and the character <code>'.'</code>.</li>
	<li>You may assume that the given Sudoku puzzle will have a single unique solution.</li>
	<li>The given board size is always <code>9x9</code>.</li>
</ul>
</div></section>
 
 ## Method One 
 
``` Java
class Solution {
    boolean[][] rowSets;
    boolean[][] colSets;
    boolean[][] boxSets;
​
    public void solveSudoku(char[][] board) {
        rowSets = new boolean[9][10];
        colSets = new boolean[9][10];
        boxSets = new boolean[9][10];
        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                if( board[i][j] == '.') continue;
                int number = board[i][j] - '0';
                int box = i/3*3 + j/3;
                rowSets[i][number] = true;
                colSets[j][number] = true;
                boxSets[box][number] = true;
            }
        }
        backtracking(board, 0, 0); 
    }
    public boolean backtracking(char[][] board, int row, int col){
        if(row == 9) return true; 
        if(col == 9 ) return backtracking(board, row + 1, 0); 
        if(board[row][col] != '.') return backtracking(board, row, col + 1);
        
        int box = row/3 * 3 + col/3;
        
        for(char c = '1'; c <= '9'; c++){
            int number = c - '0';
            if(rowSets[row][number] || colSets[col][number] || boxSets[box][number]) continue;
            
            board[row][col] = c;
            rowSets[row][number] = true;
            colSets[col][number] = true;
            boxSets[box][number] = true;
            
            if(backtracking(board,row,col+1)) return true;
            
            board[row][col] = '.';
            rowSets[row][number] = false;
            colSets[col][number] = false;
            boxSets[box][number] = false;
        }
        return false;
    }
}
​
```
