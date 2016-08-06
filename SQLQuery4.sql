CREATE TABLE [dbo].[Roles](
	[RoleID] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](200) NULL,
	[RoleType] [nvarchar](50) NULL,
	[DepartmentID] [int] NOT NULL,
	[Cid] [nvarchar](50) NOT NULL,
	[Cdt] [datetime] NOT NULL,
	[Mid] [nvarchar](50) NOT NULL,
	[Mdt] [datetime] NOT NULL,
	[RoleGrpID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]





