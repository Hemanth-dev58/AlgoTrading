"""Backtest API endpoints"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.services.backtester import backtester

router = APIRouter()


class StrategyConfig(BaseModel):
    strategy_id: str
    name: str
    description: Optional[str] = ""
    parameters: Dict[str, Any] = {}


class BacktestRequest(BaseModel):
    strategy_id: str
    symbol: str
    start_date: datetime
    end_date: datetime
    initial_capital: float = 10000.0


@router.post("/strategy")
async def add_strategy(strategy: StrategyConfig):
    """Add a strategy for backtesting"""
    config = {
        "name": strategy.name,
        "description": strategy.description,
        "parameters": strategy.parameters
    }
    
    success = backtester.add_strategy(strategy.strategy_id, config)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to add strategy")
    
    return {
        "status": "success",
        "message": f"Strategy {strategy.strategy_id} added"
    }


@router.post("/run")
async def run_backtest(request: BacktestRequest):
    """Run backtest for a strategy"""
    results = backtester.run_backtest(
        request.strategy_id,
        request.symbol,
        request.start_date,
        request.end_date,
        request.initial_capital
    )
    
    if results is None:
        raise HTTPException(status_code=500, detail="Backtest failed")
    
    return results


@router.get("/results/{strategy_id}")
async def get_results(strategy_id: str):
    """Get backtest results"""
    results = backtester.get_results(strategy_id)
    if results is None:
        raise HTTPException(
            status_code=404,
            detail=f"Results for strategy {strategy_id} not found"
        )
    
    return results


@router.get("/strategies")
async def list_strategies():
    """List all strategies"""
    strategies = backtester.list_strategies()
    return {"strategies": strategies, "count": len(strategies)}
