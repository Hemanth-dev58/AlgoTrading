"""MetaTrader 5 Connector Service"""

# Try to import MetaTrader5, but handle gracefully if not available
try:
    import MetaTrader5 as mt5
    MT5_AVAILABLE = True
except ImportError:
    MT5_AVAILABLE = False
    # Use placeholder constants when MT5 is not available
    from app.core import mt5_constants as mt5

import logging
from typing import Optional, List, Dict, Any
from datetime import datetime
import pandas as pd

from app.core.config import settings

logger = logging.getLogger(__name__)

if not MT5_AVAILABLE:
    logger.warning(
        "MetaTrader5 module not available. "
        "MT5 functionality will be disabled. "
        "Install MetaTrader5 package on Windows for full functionality."
    )


class MT5Connector:
    """MetaTrader 5 connection and trading operations"""
    
    def __init__(self):
        self.initialized = False
        self.connected = False
        self.mt5_available = MT5_AVAILABLE
        
        if not MT5_AVAILABLE:
            logger.warning(
                "MT5Connector initialized without MetaTrader5 support. "
                "All MT5 operations will fail gracefully."
            )
    
    def initialize(self, path: Optional[str] = None, timeout: int = 60000) -> bool:
        """
        Initialize MT5 connection
        
        Args:
            path: Path to MT5 terminal (optional)
            timeout: Connection timeout in milliseconds
            
        Returns:
            bool: True if successful
        """
        if not MT5_AVAILABLE:
            logger.error("MetaTrader5 module not available")
            return False
            
        try:
            mt5_path = path or settings.MT5_PATH or None
            if mt5_path:
                result = mt5.initialize(
                    path=mt5_path,
                    timeout=timeout
                )
            else:
                result = mt5.initialize(timeout=timeout)
            
            if result:
                self.initialized = True
                logger.info("MT5 initialized successfully")
                return True
            else:
                error = mt5.last_error()
                logger.error(f"MT5 initialization failed: {error}")
                return False
        except Exception as e:
            logger.error(f"MT5 initialization exception: {e}")
            return False
    
    def login(self, login: int, password: str, server: str) -> bool:
        """
        Login to MT5 account
        
        Args:
            login: Account number
            password: Account password
            server: Broker server name
            
        Returns:
            bool: True if successful
        """
        if not MT5_AVAILABLE:
            logger.error("MetaTrader5 module not available")
            return False
            
        try:
            if not self.initialized:
                if not self.initialize():
                    return False
            
            result = mt5.login(login=login, password=password, server=server)
            
            if result:
                self.connected = True
                logger.info(f"Logged in to MT5 account {login}")
                return True
            else:
                error = mt5.last_error()
                logger.error(f"MT5 login failed: {error}")
                return False
        except Exception as e:
            logger.error(f"MT5 login exception: {e}")
            return False
    
    def shutdown(self) -> None:
        """Shutdown MT5 connection"""
        if not MT5_AVAILABLE:
            logger.warning("MetaTrader5 module not available")
            return
            
        try:
            mt5.shutdown()
            self.initialized = False
            self.connected = False
            logger.info("MT5 connection closed")
        except Exception as e:
            logger.error(f"MT5 shutdown exception: {e}")
    
    def account_info(self) -> Optional[Dict[str, Any]]:
        """
        Get account information
        
        Returns:
            dict: Account information or None if failed
        """
        if not MT5_AVAILABLE:
            logger.error("MetaTrader5 module not available")
            return None
            
        try:
            if not self.connected:
                logger.warning("Not connected to MT5")
                return None
            
            account = mt5.account_info()
            if account is None:
                error = mt5.last_error()
                logger.error(f"Failed to get account info: {error}")
                return None
            
            return account._asdict()
        except Exception as e:
            logger.error(f"Account info exception: {e}")
            return None
    
    def symbol_info(self, symbol: str) -> Optional[Dict[str, Any]]:
        """
        Get symbol information
        
        Args:
            symbol: Symbol name (e.g., "EURUSD")
            
        Returns:
            dict: Symbol information or None if failed
        """
        if not MT5_AVAILABLE:
            logger.error("MetaTrader5 module not available")
            return None
            
        try:
            if not self.connected:
                logger.warning("Not connected to MT5")
                return None
            
            info = mt5.symbol_info(symbol)
            if info is None:
                error = mt5.last_error()
                logger.error(f"Failed to get symbol info for {symbol}: {error}")
                return None
            
            return info._asdict()
        except Exception as e:
            logger.error(f"Symbol info exception: {e}")
            return None
    
    def copy_rates(
        self,
        symbol: str,
        timeframe: int,
        start_pos: int = 0,
        count: int = 100
    ) -> Optional[List[Dict[str, Any]]]:
        """
        Get historical rates
        
        Args:
            symbol: Symbol name
            timeframe: Timeframe (mt5.TIMEFRAME_*)
            start_pos: Start position
            count: Number of bars
            
        Returns:
            list: List of rate dictionaries or None if failed
        """
        if not MT5_AVAILABLE:
            logger.error("MetaTrader5 module not available")
            return None
            
        try:
            if not self.connected:
                logger.warning("Not connected to MT5")
                return None
            
            rates = mt5.copy_rates_from_pos(symbol, timeframe, start_pos, count)
            if rates is None or len(rates) == 0:
                error = mt5.last_error()
                logger.error(f"Failed to get rates for {symbol}: {error}")
                return None
            
            df = pd.DataFrame(rates)
            df['time'] = pd.to_datetime(df['time'], unit='s')
            return df.to_dict('records')
        except Exception as e:
            logger.error(f"Copy rates exception: {e}")
            return None
    
    def copy_ticks(
        self,
        symbol: str,
        count: int = 100,
        flags: Optional[int] = None
    ) -> Optional[List[Dict[str, Any]]]:
        """
        Get tick data
        
        Args:
            symbol: Symbol name
            count: Number of ticks
            flags: Tick type flags (defaults to mt5.COPY_TICKS_ALL if available)
            
        Returns:
            list: List of tick dictionaries or None if failed
        """
        if not MT5_AVAILABLE:
            logger.error("MetaTrader5 module not available")
            return None
            
        try:
            if not self.connected:
                logger.warning("Not connected to MT5")
                return None
            
            # Use mt5.COPY_TICKS_ALL as default if flags not provided
            if flags is None:
                flags = mt5.COPY_TICKS_ALL
            
            ticks = mt5.copy_ticks_from(symbol, datetime.now(), count, flags)
            if ticks is None or len(ticks) == 0:
                error = mt5.last_error()
                logger.error(f"Failed to get ticks for {symbol}: {error}")
                return None
            
            df = pd.DataFrame(ticks)
            df['time'] = pd.to_datetime(df['time'], unit='s')
            return df.to_dict('records')
        except Exception as e:
            logger.error(f"Copy ticks exception: {e}")
            return None
    
    def order_send(self, request: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Send trading order
        
        Args:
            request: Order request dictionary
            
        Returns:
            dict: Order result or None if failed
        """
        if not MT5_AVAILABLE:
            logger.error("MetaTrader5 module not available")
            return None
            
        try:
            if not self.connected:
                logger.warning("Not connected to MT5")
                return None
            
            result = mt5.order_send(request)
            if result is None:
                error = mt5.last_error()
                logger.error(f"Failed to send order: {error}")
                return None
            
            return result._asdict()
        except Exception as e:
            logger.error(f"Order send exception: {e}")
            return None
    
    def positions_get(self, symbol: Optional[str] = None) -> Optional[List[Dict[str, Any]]]:
        """
        Get open positions
        
        Args:
            symbol: Symbol name (optional, None for all)
            
        Returns:
            list: List of position dictionaries or None if failed
        """
        if not MT5_AVAILABLE:
            logger.error("MetaTrader5 module not available")
            return None
            
        try:
            if not self.connected:
                logger.warning("Not connected to MT5")
                return None
            
            if symbol:
                positions = mt5.positions_get(symbol=symbol)
            else:
                positions = mt5.positions_get()
            
            if positions is None:
                error = mt5.last_error()
                logger.error(f"Failed to get positions: {error}")
                return None
            
            return [pos._asdict() for pos in positions]
        except Exception as e:
            logger.error(f"Positions get exception: {e}")
            return None
    
    def history_deals_get(
        self,
        from_date: datetime,
        to_date: datetime,
        group: str = ""
    ) -> Optional[List[Dict[str, Any]]]:
        """
        Get historical deals
        
        Args:
            from_date: Start date
            to_date: End date
            group: Symbol group filter
            
        Returns:
            list: List of deal dictionaries or None if failed
        """
        if not MT5_AVAILABLE:
            logger.error("MetaTrader5 module not available")
            return None
            
        try:
            if not self.connected:
                logger.warning("Not connected to MT5")
                return None
            
            if group:
                deals = mt5.history_deals_get(from_date, to_date, group=group)
            else:
                deals = mt5.history_deals_get(from_date, to_date)
            
            if deals is None:
                error = mt5.last_error()
                logger.error(f"Failed to get history deals: {error}")
                return None
            
            return [deal._asdict() for deal in deals]
        except Exception as e:
            logger.error(f"History deals get exception: {e}")
            return None


# Global MT5 connector instance
mt5_connector = MT5Connector()
