<template>
  <div class="crypto-prices-container">
    <!-- BTC价格 -->
    <div class="price-item">
      <div class="crypto-info">
        <div class="crypto-icon btc-icon">₿</div>
        <span class="crypto-symbol">BTC/USDT</span>
      </div>
      <div class="price-details">
        <div class="current-price" :class="getPriceChangeClass(btcData.change)">
          ${{ formatPrice(btcData.price) }}
        </div>
        <div class="price-change" :class="getPriceChangeClass(btcData.change)">
          <el-icon class="trend-icon">
            <component :is="getTrendIcon(btcData.change)" />
          </el-icon>
          <span>{{ formatChange(btcData.change) }} ({{ formatPercentage(btcData.changePercent) }})</span>
        </div>
      </div>
    </div>
    
    <!-- ETH价格 -->
    <div class="price-item">
      <div class="crypto-info">
        <div class="crypto-icon eth-icon">Ξ</div>
        <span class="crypto-symbol">ETH/USDT</span>
      </div>
      <div class="price-details">
        <div class="current-price" :class="getPriceChangeClass(ethData.change)">
          ${{ formatPrice(ethData.price) }}
        </div>
        <div class="price-change" :class="getPriceChangeClass(ethData.change)">
          <el-icon class="trend-icon">
            <component :is="getTrendIcon(ethData.change)" />
          </el-icon>
          <span>{{ formatChange(ethData.change) }} ({{ formatPercentage(ethData.changePercent) }})</span>
        </div>
      </div>
    </div>
    
    <div class="update-time">
      {{ updateTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowUp, ArrowDown, Minus } from '@element-plus/icons-vue'

interface CryptoData {
  price: number
  change: number
  changePercent: number
  high24h: number
  low24h: number
  volume: number
}

const btcData = ref<CryptoData>({
  price: 43250.86,
  change: 1250.32,
  changePercent: 2.98,
  high24h: 44100.50,
  low24h: 41800.25,
  volume: 28450000000
})

const ethData = ref<CryptoData>({
  price: 2567.89,
  change: -45.67,
  changePercent: -1.75,
  high24h: 2650.30,
  low24h: 2520.15,
  volume: 15680000000
})

const updateTime = ref('')
let updateInterval: NodeJS.Timeout | null = null

// 模拟价格数据（实际项目中应该调用真实API）
const simulatePriceData = () => {
  // 模拟BTC价格波动 (-0.5% 到 +0.5%)
  const btcRandomChange = (Math.random() - 0.5) * 0.01
  const newBtcPrice = btcData.value.price * (1 + btcRandomChange)
  const btcPriceChange = newBtcPrice - btcData.value.price
  const btcChangePercent = (btcPriceChange / btcData.value.price) * 100
  
  btcData.value = {
    ...btcData.value,
    price: newBtcPrice,
    change: btcPriceChange,
    changePercent: btcChangePercent
  }
  
  // 模拟ETH价格波动 (-0.5% 到 +0.5%)
  const ethRandomChange = (Math.random() - 0.5) * 0.01
  const newEthPrice = ethData.value.price * (1 + ethRandomChange)
  const ethPriceChange = newEthPrice - ethData.value.price
  const ethChangePercent = (ethPriceChange / ethData.value.price) * 100
  
  ethData.value = {
    ...ethData.value,
    price: newEthPrice,
    change: ethPriceChange,
    changePercent: ethChangePercent
  }
  
  updateTime.value = new Date().toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取真实BTC价格数据（可选）
const fetchBTCPrice = async () => {
  try {
    // 这里可以调用真实的加密货币API
    // 例如 Binance API, CoinGecko API 等
    // const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
    // const data = await response.json()
    
    // 暂时使用模拟数据
    simulatePriceData()
  } catch (error) {
    console.warn('获取BTC价格失败，使用模拟数据:', error)
    simulatePriceData()
  }
}

// 价格变化样式类
const getPriceChangeClass = (change: number) => {
  if (change > 0) return 'price-up'
  if (change < 0) return 'price-down'
  return 'price-neutral'
}

// 趋势图标
const getTrendIcon = (change: number) => {
  if (change > 0) return ArrowUp
  if (change < 0) return ArrowDown
  return Minus
}

// 格式化价格
const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化变化金额
const formatChange = (change: number) => {
  const prefix = change >= 0 ? '+' : ''
  return prefix + change.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化百分比
const formatPercentage = (percent: number) => {
  const prefix = percent >= 0 ? '+' : ''
  return prefix + percent.toFixed(2) + '%'
}



onMounted(() => {
  // 立即获取一次数据
  fetchBTCPrice()
  
  // 每3秒更新一次数据
  updateInterval = setInterval(() => {
    fetchBTCPrice()
  }, 3000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style lang="scss" scoped>
.crypto-prices-container {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .price-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    background: rgba(240, 185, 11, 0.1);
    border: 1px solid rgba(240, 185, 11, 0.2);
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(240, 185, 11, 0.15);
      border-color: rgba(240, 185, 11, 0.4);
    }
    
    .crypto-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .crypto-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 700;
        
        &.btc-icon {
          background: linear-gradient(135deg, #f7931a 0%, #ffb948 100%);
          color: #fff;
        }
        
        &.eth-icon {
          background: linear-gradient(135deg, #627eea 0%, #8fa8ff 100%);
          color: #fff;
        }
      }
      
      .crypto-symbol {
        color: #b7bdc6;
        font-size: 13px;
        font-weight: 600;
        min-width: 70px;
      }
    }
    
    .price-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      
      .current-price {
        font-size: 16px;
        font-weight: 700;
        font-family: 'Courier New', monospace;
        
        &.price-up {
          color: #0ecb81;
        }
        
        &.price-down {
          color: #f6465d;
        }
        
        &.price-neutral {
          color: #b7bdc6;
        }
      }
      
      .price-change {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 500;
        font-family: 'Courier New', monospace;
        
        &.price-up {
          color: #0ecb81;
        }
        
        &.price-down {
          color: #f6465d;
        }
        
        &.price-neutral {
          color: #b7bdc6;
        }
        
        .trend-icon {
          font-size: 12px;
        }
      }
    }
  }
  
  .update-time {
    color: #848e9c;
    font-size: 11px;
    font-family: 'Courier New', monospace;
    opacity: 0.8;
    margin-left: 8px;
  }
}
</style> 