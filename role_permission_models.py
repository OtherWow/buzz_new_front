from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class BoRole(SQLModel, table=True):
    """角色表"""
    __tablename__ = "bo_roles"

    id: int = Field(default=None, primary_key=True, index=True, description="角色ID")
    name: str = Field(max_length=100, unique=True, nullable=False, description="角色名称")
    code: str = Field(max_length=50, unique=True, nullable=False, description="角色编码")
    description: Optional[str] = Field(max_length=500, nullable=True, description="角色描述")
    level: int = Field(default=1, description="角色级别，数字越小权限越高")
    is_active: int = Field(default=1, description="是否启用 0.禁用 1.启用")
    is_system: int = Field(default=0, description="是否系统角色 0.否 1.是（系统角色不可删除）")
    create_date: datetime = Field(default_factory=datetime.now, nullable=False, description="创建日期")
    update_date: datetime = Field(default_factory=datetime.now, sa_column_kwargs={"onupdate": datetime.now}, nullable=False, description="更新日期")
    
    def to_dict(self):
        result = {}
        for column in self.__annotations__:
            value = getattr(self, column)
            if isinstance(value, datetime):
                result[column] = value.isoformat()
            else:
                result[column] = value
        return result


class BoPermission(SQLModel, table=True):
    """权限表"""
    __tablename__ = "bo_permissions"

    id: int = Field(default=None, primary_key=True, index=True, description="权限ID")
    name: str = Field(max_length=100, nullable=False, description="权限名称")
    code: str = Field(max_length=100, unique=True, nullable=False, description="权限编码")
    resource: str = Field(max_length=100, nullable=False, description="资源名称")
    action: str = Field(max_length=50, nullable=False, description="操作类型")
    description: Optional[str] = Field(max_length=500, nullable=True, description="权限描述")
    module: str = Field(max_length=50, nullable=False, description="所属模块")
    is_active: int = Field(default=1, description="是否启用 0.禁用 1.启用")
    create_date: datetime = Field(default_factory=datetime.now, nullable=False, description="创建日期")
    update_date: datetime = Field(default_factory=datetime.now, sa_column_kwargs={"onupdate": datetime.now}, nullable=False, description="更新日期")
    
    def to_dict(self):
        result = {}
        for column in self.__annotations__:
            value = getattr(self, column)
            if isinstance(value, datetime):
                result[column] = value.isoformat()
            else:
                result[column] = value
        return result


class BoRolePermission(SQLModel, table=True):
    """角色权限关联表"""
    __tablename__ = "bo_role_permissions"

    id: int = Field(default=None, primary_key=True, index=True, description="主键ID")
    role_id: int = Field(foreign_key="bo_roles.id", nullable=False, description="角色ID")
    permission_id: int = Field(foreign_key="bo_permissions.id", nullable=False, description="权限ID")
    create_date: datetime = Field(default_factory=datetime.now, nullable=False, description="创建日期")
    
    def to_dict(self):
        result = {}
        for column in self.__annotations__:
            value = getattr(self, column)
            if isinstance(value, datetime):
                result[column] = value.isoformat()
            else:
                result[column] = value
        return result


class BoUserRole(SQLModel, table=True):
    """用户角色关联表"""
    __tablename__ = "bo_user_roles"

    id: int = Field(default=None, primary_key=True, index=True, description="主键ID")
    user_id: int = Field(foreign_key="bo_base_users.id", nullable=False, description="用户ID")
    role_id: int = Field(foreign_key="bo_roles.id", nullable=False, description="角色ID")
    is_current: int = Field(default=0, description="是否当前使用角色 0.否 1.是")
    create_date: datetime = Field(default_factory=datetime.now, nullable=False, description="分配日期")
    update_date: datetime = Field(default_factory=datetime.now, sa_column_kwargs={"onupdate": datetime.now}, nullable=False, description="更新日期")
    
    def to_dict(self):
        result = {}
        for column in self.__annotations__:
            value = getattr(self, column)
            if isinstance(value, datetime):
                result[column] = value.isoformat()
            else:
                result[column] = value
        return result


class BoMenu(SQLModel, table=True):
    """菜单表"""
    __tablename__ = "bo_menus"

    id: int = Field(default=None, primary_key=True, index=True, description="菜单ID")
    name: str = Field(max_length=100, nullable=False, description="菜单名称")
    path: str = Field(max_length=200, nullable=False, description="菜单路径")
    component: Optional[str] = Field(max_length=200, nullable=True, description="组件路径")
    icon: Optional[str] = Field(max_length=100, nullable=True, description="菜单图标")
    parent_id: Optional[int] = Field(default=0, description="父菜单ID，0表示根菜单")
    sort_order: int = Field(default=0, description="排序顺序")
    permission_code: Optional[str] = Field(max_length=100, nullable=True, description="所需权限编码")
    is_visible: int = Field(default=1, description="是否可见 0.隐藏 1.显示")
    is_active: int = Field(default=1, description="是否启用 0.禁用 1.启用")
    create_date: datetime = Field(default_factory=datetime.now, nullable=False, description="创建日期")
    update_date: datetime = Field(default_factory=datetime.now, sa_column_kwargs={"onupdate": datetime.now}, nullable=False, description="更新日期")
    
    def to_dict(self):
        result = {}
        for column in self.__annotations__:
            value = getattr(self, column)
            if isinstance(value, datetime):
                result[column] = value.isoformat()
            else:
                result[column] = value
        return result 