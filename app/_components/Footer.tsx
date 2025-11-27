import { Flex } from "antd";
import { Footer as AntdFooter } from "antd/es/layout/layout";
function Footer() {
  return (
    <AntdFooter>
      <Flex vertical justify="space-evenly" align="center">
        <p>
          © 2025 - Universitat Oberta de Catalunya - Tots els drets reservats
        </p>
        <p>
          <a href="#">Preguntes Freqüents</a> | <a href="#">Contacte</a>
        </p>
      </Flex>
    </AntdFooter>
  );
}

export default Footer;
