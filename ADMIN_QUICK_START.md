# Admin Dashboard - Quick Command Reference

## 🎯 Common Tasks

### Managing Menu Items

**To Add Menu Item:**
1. Dashboard → 🍽️ Menu tab
2. Click "+ Add Item"
3. Enter: Name, Category, Price, Prep Time
4. Click "Add Menu Item"

**To Edit Menu Item:**
1. Dashboard → 🍽️ Menu tab
2. Find item in table
3. Click "Edit" button
4. Modify fields
5. Click "Update Item"

**To Delete Menu Item:**
1. Dashboard → 🍽️ Menu tab
2. Find item in table
3. Click "Delete" button
4. Confirm deletion

---

### Managing Rooms

**To Add Room:**
1. Dashboard → 🛏️ Rooms tab
2. Click "+ Add Room"
3. Fill: Room #, Name, Type, Price, Capacity
4. Click "Add Room"

**To Change Room Price:**
1. Dashboard → 🛏️ Rooms tab
2. Click "Edit" on room
3. Change "Price Per Night" value
4. Click "Update Room"

**To Mark Room Unavailable:**
1. Dashboard → 🛏️ Rooms tab
2. Click "Edit" on room
3. Uncheck "Available" box
4. Click "Update Room"

**To Remove Room:**
1. Dashboard → 🛏️ Rooms tab
2. Click "Delete" on room
3. Confirm deletion

---

### Managing Event Halls

**To Add Hall:**
1. Dashboard → 🏛️ Halls tab
2. Click "+ Add Hall"
3. Enter: Name, Type, Capacity, Area, Base Price
4. Click "Add Hall"

**To Update Hall Pricing:**
1. Dashboard → 🏛️ Halls tab
2. Click "Edit" on hall
3. Change "Base Price" value
4. Click "Update Hall"

**To Remove Hall:**
1. Dashboard → 🏛️ Halls tab
2. Click "Delete" on hall
3. Confirm deletion

---

### Managing Staff

**To Create Staff Account:**
1. Dashboard → 👥 Staff tab
2. Click "+ Add Staff"
3. Fill: Name, Email, Password, Role
4. Select role: Staff or Admin
5. Click "Add Staff"

**To Promote Staff to Admin:**
1. Dashboard → 👥 Staff tab
2. Click "Edit" on staff
3. Change Role to "Admin"
4. Click "Update Staff"

**To Deactivate Staff:**
1. Dashboard → 👥 Staff tab
2. Click "Active" button on staff (turns red = inactive)
3. Automatically toggles status

**To Reactivate Staff:**
1. Dashboard → 👥 Staff tab
2. Click "Inactive" button on staff (turns green = active)
3. Automatically toggles status

**To Reset Staff Password:**
1. Dashboard → 👥 Staff tab
2. Click "Edit" on staff
3. Enter new password
4. Click "Update Staff"
5. Share new password securely

**To Remove Staff:**
1. Dashboard → 👥 Staff tab
2. Click "Delete" on staff
3. Confirm deletion

---

## 📊 Tab Navigation

```
┌─────────────────────────────────────────────────────┐
│ Dashboard Tabs:                                     │
├─────────────────────────────────────────────────────┤
│ Overview     🍽️ Menu     🛏️ Rooms     🏛️ Halls    │
│ 👥 Staff     Bookings    Food Orders   👥 Users   │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Form Fields Quick Reference

### Menu Item Fields
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Name | Text | Yes | Nyama Nyama |
| Category | Dropdown | Yes | Main |
| Price | Number | Yes | 450 |
| Description | Text | No | Grilled beef with rice |
| Prep Time | Number | Yes | 25 (minutes) |
| Image URL | Text | No | https://... |

### Room Fields
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Room # | Text | Yes | 101 |
| Name | Text | Yes | Deluxe Room |
| Type | Dropdown | Yes | Deluxe |
| Price/Night | Number | Yes | 5000 |
| Capacity | Number | Yes | 2 |
| Description | Text | No | Beautiful with AC |
| Available | Checkbox | No | Checked |

### Hall Fields
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Name | Text | Yes | Grand Hall |
| Type | Dropdown | Yes | Banquet |
| Capacity | Number | Yes | 200 |
| Area | Number | No | 400 (sq meters) |
| Base Price | Number | Yes | 15000 |
| Available | Checkbox | No | Checked |

### Staff Fields
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Name | Text | Yes | John Kamau |
| Email | Email | Yes | john@resort.com |
| Password | Text | Yes* | SecurePass123 |
| Role | Dropdown | Yes | Staff |
| Status | Toggle | No | Active |

*Required for new staff, optional for edits

---

## 🔐 Security Quick Tips

✅ **DO:**
- Use strong passwords (min 8 chars, mix upper/lower/numbers)
- Share passwords securely (never via email/text)
- Keep admin token secure (don't share)
- Logout when done using admin dashboard
- Review staff accounts regularly
- Deactivate unused accounts

❌ **DON'T:**
- Share admin login credentials
- Write down passwords
- Use same password for multiple accounts
- Allow unauthorized access to dashboard
- Delete items without verification
- Update prices without double-checking

---

## ⚡ Speed Tips

**Fastest Way to Add Menu Item:**
```
Admin → 🍽️ Menu → + Add Item → Fill form → Add
(Takes ~30 seconds)
```

**Fastest Way to Update Room Price:**
```
Admin → 🛏️ Rooms → Edit → Change Price → Update
(Takes ~20 seconds)
```

**Fastest Way to Create Staff:**
```
Admin → 👥 Staff → + Add Staff → Fill form → Add
(Takes ~45 seconds)
```

---

## 🆘 Troubleshooting Quick Fixes

**Form won't submit:**
- ✓ Check all required fields (marked in form)
- ✓ Verify email is valid (has @)
- ✓ Check password has min 8 characters
- ✓ Verify numbers are positive values

**Item doesn't appear after adding:**
- ✓ Scroll down table to find new item
- ✓ Refresh page (F5)
- ✓ Check error message (red box)
- ✓ Verify internet connection

**Can't login to admin:**
- ✓ Verify username/password correct
- ✓ Check CAPS LOCK is off
- ✓ Clear browser cache (Ctrl+Shift+Del)
- ✓ Try different browser

**Changes not saving:**
- ✓ Check internet connection
- ✓ Verify no error message appears
- ✓ Try refresh (F5) and edit again
- ✓ Check backend is running

---

## 📋 Pre-Launch Checklist

Before going live, verify:

- [ ] All menu items added correctly
- [ ] All room types and pricing set
- [ ] All event halls available
- [ ] Admin staff accounts created
- [ ] Test prices are correct
- [ ] Test items are deleted (not real items)
- [ ] Database backup created
- [ ] Backend API running smoothly
- [ ] Dashboard loads without errors
- [ ] All CRUD operations working (Create, Read, Update, Delete)

---

## 🎯 Common Workflows

### Weekly Menu Update
```
1. Dashboard → 🍽️ Menu
2. Review current items
3. Delete old specials
4. Add new weekly specials
5. Update prices if needed
6. Done!
```

### Monthly Staff Review
```
1. Dashboard → 👥 Staff
2. Review all staff accounts
3. Deactivate inactive staff
4. Verify active staff are correct
5. Add any new staff
6. Done!
```

### Seasonal Room Pricing
```
1. Dashboard → 🛏️ Rooms
2. For each room, click Edit
3. Update Price Per Night for season
4. Click Update
5. Repeat for all rooms
6. Done!
```

---

## 📱 Mobile Admin Access

You can manage admin tasks from your phone:

1. Open browser on phone
2. Go to your resort website
3. Click `🔐 Admin` in header
4. Login with credentials
5. TIP: Use portrait mode for better viewing

**Note**: All forms are responsive and mobile-friendly!

---

## 🚀 Pro Tips

💡 **Sort items by dragging column headers** (if implemented)

💡 **Use emojis in names** for visual organization:
- 🌶️ Spicy items
- 🥗 Vegetarian items
- ♿ Accessible rooms

💡 **Batch update prices** by opening multiple items in tabs

💡 **Export data** for backup (if export feature available)

💡 **Use descriptions** to note special details:
- "During rainy season"
- "Peak season rate"
- "Weekend price"

---

## 📞 Help Resources

**Getting Started**: See [ADMIN_SETUP_COMPLETE.md](ADMIN_SETUP_COMPLETE.md)

**Detailed Reference**: See [ADMIN_DASHBOARD_INTEGRATION.md](ADMIN_DASHBOARD_INTEGRATION.md)

**API Documentation**: Check backend `/api/docs`

**Technical Details**: Check [ADMIN_DASHBOARD_READY.md](ADMIN_DASHBOARD_READY.md)

---

**Last Updated**: Today
**Status**: ✅ Ready to Use
**Version**: 1.0 Complete

Happy managing! 🎉
