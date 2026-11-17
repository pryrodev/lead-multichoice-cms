ALTER TABLE `shipments`
  ADD COLUMN `client_request_id` CHAR(32) NULL,
  ADD INDEX `idx_shipments_client_request` (`client_request_id`),
  ADD CONSTRAINT `fk_shipments_client_request`
    FOREIGN KEY (`client_request_id`) REFERENCES `client_requests` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
