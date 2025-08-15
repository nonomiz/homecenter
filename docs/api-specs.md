# API Specifications

## Store Management APIs

### Check Store ID Availability
점포 ID 중복 확인을 위한 API입니다.

**Endpoint:** `GET /api/stores/check-id/:shopId`

**Parameters:**
- `shopId` (path parameter): 확인할 점포 ID

**Response:**
```json
{
  "success": true,
  "isAvailable": boolean,
  "message": string
}
```

**Example Response (Available):**
```json
{
  "success": true,
  "isAvailable": true,
  "message": "사용 가능한 ID입니다."
}
```

**Example Response (Duplicate):**
```json
{
  "success": true,
  "isAvailable": false,
  "message": "이미 사용 중인 ID입니다."
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**HTTP Status Codes:**
- `200`: 성공
- `400`: 잘못된 요청 (shopId가 비어있거나 형식이 잘못된 경우)
- `500`: 서버 내부 오류

**Implementation Notes:**
- 데이터베이스에서 해당 shop_id가 이미 존재하는지 확인
- 대소문자 구분 없이 검색 (선택사항)
- 특수문자나 공백 처리 로직 필요
- 동시 요청에 대한 처리 고려 (race condition 방지)

## Backend Implementation Example (Node.js/Express)

```javascript
// routes/stores.js
router.get('/check-id/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    
    if (!shopId || shopId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: '점포 ID가 필요합니다.',
        code: 'MISSING_SHOP_ID'
      });
    }
    
    // 데이터베이스에서 중복 확인
    const existingStore = await Store.findOne({ 
      where: { shop_id: shopId.trim() } 
    });
    
    const isAvailable = !existingStore;
    
    res.json({
      success: true,
      isAvailable,
      message: isAvailable ? '사용 가능한 ID입니다.' : '이미 사용 중인 ID입니다.'
    });
    
  } catch (error) {
    console.error('Error checking shop ID:', error);
    res.status(500).json({
      success: false,
      error: '중복 확인 중 오류가 발생했습니다.',
      code: 'INTERNAL_ERROR'
    });
  }
});
```

## Frontend Integration

프론트엔드에서는 다음과 같이 사용할 수 있습니다:

```typescript
const checkShopIdDuplicate = async () => {
  if (!form.shop_id.trim()) {
    setCheckMessage('점포 ID를 입력해주세요.');
    return;
  }

  setCheckStatus('checking');
  setCheckMessage('');

  try {
    const response = await apiClient.get(`/stores/check-id/${form.shop_id}`);
    const { isAvailable, message } = response.data;
    
    if (isAvailable) {
      setCheckStatus('available');
      setCheckMessage(message);
    } else {
      setCheckStatus('duplicate');
      setCheckMessage(message);
    }
  } catch (error) {
    setCheckStatus('duplicate');
    setCheckMessage('중복 확인 중 오류가 발생했습니다.');
  }
};
```

