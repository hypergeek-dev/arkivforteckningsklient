<center>

# Informationshanteringsplans-verktyget (IHP-v)

</center>

<p align="center">
<img src="./bilder/Isolated_IHPv_logo_with_text_black.png" align="center"
alt="IHP-v logo" alt="Logo" width="180" height="80">
</p>

## **IHP-verktyget (IHP-v)** används för att hantera det som behövs för att digitalisera informationshanteringsplanen. Den utgör grunden för informationsstyrningen av verksamsamhetsinformationen. IT-stödet är uppdelat i fyra huvudkomponenter:


### **Modellbyggaren**
[![Modellbyggaren](./bilder/thumbnails/startsida_thumb.png)](./bilder/startsida.png)

#### Funktioner för klassificeringsstruktur, administration av strukturmodeller och koppling av informationshanteringsregler för att bygga upp informationshanteringsplanen.


### **Regelbank**
[![Regelbank](./bilder/thumbnails/gallringsregel_thumb.png)](./bilder/gallringsregel.png)
#### Informationshanteringsregler (ex: gallringsregler, arkiveringsregler)


### **Informationsredovisning**
[![Regelbank](./bilder/thumbnails/rapportvy_thumb.png)](./bilder/rapportvy.png)
#### Innehåller funktioner för rapporter utifrån information i de olika komponenterna såsom klassificeringsstruktur, informationshanteringsplan och strukturmodeller.


### **Egna element**

#### Dynamisk möjlighet att utöka IHP.
[![Regelbank](./bilder/thumbnails/egnaelement_thumb.png)](./bilder/egnaelement.png)


## Byggt med

![Static Badge](https://img.shields.io/static/v1?label=React&message=18.2.0&color=informational?style=for-the-badge&logo=react)
![Static Badge](https://img.shields.io/static/v1?label=MUI%20Core&message=6.0.0&color=informational?style=for-the-badge&logo=mui)
![Static Badge](https://img.shields.io/static/v1?label=Redux-Toolkit&message=1.9.1&color=informational?style=for-the-badge&logo=redux)
![Static Badge](https://img.shields.io/static/v1?label=Webpack&message=5.96.1&color=informational?style=for-the-badge&logo=webpack)
![Static Badge](https://img.shields.io/static/v1?label=Typescript&message=5.6.3&color=informational?style=for-the-badge&logo=typescript)
![Static Badge](https://img.shields.io/static/v1?label=Spring%20Boot&message=2.0.8&color=informational?style=for-the-badge&logo=springboot)
![Static Badge](https://img.shields.io/static/v1?label=Postgresql&message=42.7.6&color=informational?style=for-the-badge&logo=postgresql)


## Kom igång
Projektet är byggt i två delar med en backend i Java Spring Boot och en frontend i React och Typescript. Databasen är Postgresql. Byggs med Docker Compose. Backend återfinns i /backend, frontend i /frontend och databasfilerna körs i ordningen som dom ligger i /databas, ordningen är viktig. Databasen kommer förkonfigurerad med exempeldata, en av varje undertyp för att visa hur grundstrukturen ser ut, allt sparat i en klassificieringsstruktur sparad som utkast.

### Förutsättningar

![Postgresql](https://img.shields.io/static/v1?label=Postgresql&message=42.7.6&color=informational?style=for-the-badge&logo=postgresql)

![Java](https://img.shields.io/static/v1?label=Java&message=17%2B+&color=informational?style=for-the-badge&logo=openjdk)

![React](https://img.shields.io/static/v1?label=React&message=18&color=informational?style=for-the-badge&logo=react)

![Docker Compose](https://img.shields.io/static/v1?label=Docker%20Compose&message=v2.35.1&color=informational?style=for-the-badge&logo=docker)

<details><summary><b>Installationsinstruktioner</b></summary>

1. Se till att Docker Compose är installerat (https://docs.docker.com/compose/install/)

2. Klona ner repot:

    ```sh
    git clone https://github.com/migrationsverket/ihpv.git
    ```

3. Bygg med hjälp av Docker Compose:

   ```sh
   docker compose up
   ```

4. Öppna webapplikationen:

   ```js
   http://localhost:8081/
   ```

5. Vill du titta i databasen genom pgadmin4 öppna:

   ```sh
   http://localhost:8082/
   ```

</details>

## License

Distributed under the CC0 1.0 Universal License. See <a href="LICENSE.txt">`LICENSE`</a> for more information.




