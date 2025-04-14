-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `country` VARCHAR(50) NULL,
    `isPopular` BOOLEAN NULL DEFAULT false,
    `logo` VARCHAR(255) NULL,
    `website` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cartitems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cartId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price` DECIMAL(10, 2) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `productId`(`productId`),
    UNIQUE INDEX `cartId`(`cartId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` INTEGER NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(255) NULL,
    `slug` VARCHAR(255) NULL,
    `is_featured` BOOLEAN NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `slug`(`slug`),
    INDEX `parent_id`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderitems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price` DECIMAL(10, 2) NOT NULL,
    `image` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `orderId`(`orderId`),
    INDEX `productId`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `shippingAddress` TEXT NOT NULL,
    `paymentMethod` VARCHAR(50) NOT NULL,
    `itemsPrice` DECIMAL(10, 2) NOT NULL,
    `shippingPrice` DECIMAL(10, 2) NOT NULL,
    `taxPrice` DECIMAL(10, 2) NOT NULL,
    `totalPrice` DECIMAL(10, 2) NOT NULL,
    `isPaid` BOOLEAN NULL DEFAULT false,
    `paidAt` TIMESTAMP(0) NULL,
    `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NULL DEFAULT 'pending',
    `deliveredAt` TIMESTAMP(0) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `status`(`status`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `price` DECIMAL(13, 2) NULL,
    `status` ENUM('published', 'draft') NULL DEFAULT 'published',
    `gallery` LONGTEXT NULL,
    `quantity` INTEGER NULL DEFAULT 0,
    `rating` DECIMAL(2, 1) NULL,
    `slug` VARCHAR(100) NULL,
    `collection` VARCHAR(100) NULL,
    `isFeatured` BOOLEAN NULL DEFAULT false,
    `featuredImage` LONGTEXT NULL,
    `isNewArrival` BOOLEAN NULL DEFAULT false,
    `isBestSeller` BOOLEAN NULL DEFAULT false,
    `isOnSale` BOOLEAN NULL DEFAULT false,
    `salePrice` DECIMAL(13, 2) NULL,
    `saleEndDate` DATE NULL,
    `discountType` VARCHAR(20) NULL DEFAULT 'none',
    `relatedProducts` LONGTEXT NULL,
    `packageContents` LONGTEXT NULL,
    `categoryId` INTEGER NULL,
    `brandId` INTEGER NULL,
    `sku` VARCHAR(50) NULL,
    `weight` VARCHAR(50) NULL,
    `frequencyResponse` VARCHAR(100) NULL,
    `impedance` VARCHAR(50) NULL,
    `connectivity` VARCHAR(100) NULL,
    `batteryLife` VARCHAR(50) NULL,
    `warranty` VARCHAR(100) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `slug`(`slug`),
    INDEX `brandId`(`brandId`),
    INDEX `categoryId`(`categoryId`),
    INDEX `name`(`name`),
    INDEX `slug_2`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15) NULL,
    `address` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `country` VARCHAR(100) NULL,
    `postalCode` VARCHAR(20) NULL,
    `profileImage` VARCHAR(255) NULL,
    `isAdmin` BOOLEAN NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `email_2`(`email`),
    INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cartitems` ADD CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `cartitems` ADD CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `orderitems` ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `orderitems` ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;
