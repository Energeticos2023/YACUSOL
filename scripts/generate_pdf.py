from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate, Frame, Image, KeepTogether, PageTemplate,
    Paragraph, Spacer, Table, TableStyle
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "docs" / "bases-campeonato-anin-2026.pdf"
LOGO = ROOT / "assets" / "images" / "logo-anin.png"

NAVY = colors.HexColor("#0B1F3A")
RED = colors.HexColor("#EC1C2E")
GOLD = colors.HexColor("#D6A72B")
PALE = colors.HexColor("#F3F6FA")
INK = colors.HexColor("#17243A")
MUTED = colors.HexColor("#5B6879")

font_regular = "Helvetica"
font_bold = "Helvetica-Bold"
windows_fonts = Path("C:/Windows/Fonts")
if (windows_fonts / "arial.ttf").exists():
    pdfmetrics.registerFont(TTFont("Arial", str(windows_fonts / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-Bold", str(windows_fonts / "arialbd.ttf")))
    font_regular, font_bold = "Arial", "Arial-Bold"


class NumberedDocTemplate(BaseDocTemplate):
    pass


def header_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setFillColor(NAVY)
    canvas.rect(0, h - 17 * mm, w, 17 * mm, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.rect(0, h - 18.4 * mm, w, 1.4 * mm, fill=1, stroke=0)
    if LOGO.exists():
        canvas.drawImage(str(LOGO), 16 * mm, h - 14.5 * mm, width=23 * mm, height=10.5 * mm, preserveAspectRatio=True, mask="auto")
    canvas.setFont(font_bold, 8.5)
    canvas.setFillColor(colors.white)
    canvas.drawRightString(w - 16 * mm, h - 10.5 * mm, "CAMPEONATO RELÁMPAGO · ANIVERSARIO ANIN")
    canvas.setStrokeColor(colors.HexColor("#DDE3EB"))
    canvas.line(16 * mm, 14 * mm, w - 16 * mm, 14 * mm)
    canvas.setFont(font_regular, 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(16 * mm, 9.5 * mm, "Organiza: UDE Arequipa · Viernes 17 de julio de 2026")
    canvas.drawRightString(w - 16 * mm, 9.5 * mm, f"Página {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
title = ParagraphStyle("TitleANIN", parent=styles["Title"], fontName=font_bold, fontSize=23, leading=26, textColor=NAVY, alignment=TA_CENTER, spaceAfter=5 * mm)
subtitle = ParagraphStyle("SubtitleANIN", parent=styles["Normal"], fontName=font_regular, fontSize=10, leading=14, textColor=MUTED, alignment=TA_CENTER, spaceAfter=6 * mm)
h1 = ParagraphStyle("H1ANIN", parent=styles["Heading2"], fontName=font_bold, fontSize=13, leading=16, textColor=NAVY, spaceBefore=4 * mm, spaceAfter=2.5 * mm)
body = ParagraphStyle("BodyANIN", parent=styles["BodyText"], fontName=font_regular, fontSize=9.4, leading=13.5, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=2.1 * mm)
bullet = ParagraphStyle("BulletANIN", parent=body, leftIndent=5 * mm, firstLineIndent=-3.5 * mm, bulletIndent=0, spaceAfter=1.6 * mm)
callout = ParagraphStyle("CalloutANIN", parent=body, fontName=font_bold, textColor=NAVY, alignment=TA_CENTER, leading=14)
table_header = ParagraphStyle("TableHeaderANIN", parent=callout, textColor=colors.white, fontSize=8.5)


def P(text, style=body):
    return Paragraph(text, style)


story = [Spacer(1, 8 * mm)]
if LOGO.exists():
    logo = Image(str(LOGO), width=42 * mm, height=24 * mm, kind="proportional")
    logo.hAlign = "CENTER"
    story += [logo, Spacer(1, 3 * mm)]
story += [
    P("BASES DEL CAMPEONATO RELÁMPAGO", title),
    P("ANIVERSARIO DE LA AUTORIDAD NACIONAL DE INFRAESTRUCTURA - ANIN", subtitle),
]

event_data = [
    [P("FECHA", table_header), P("HORA", table_header), P("LOCAL", table_header), P("ORGANIZA", table_header)],
    [P("Viernes 17 de julio de 2026"), P("8:00 p. m. - 10:00 p. m."), P('<link href="https://maps.app.goo.gl/oDiJbjf8zxkYyega8" color="#EC1C2E"><u>Cancha Balón Fuego - ver mapa</u></link>'), P("UDE Arequipa")],
]
t = Table(event_data, colWidths=[42 * mm, 36 * mm, 62 * mm, 35 * mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("BACKGROUND", (0, 1), (-1, 1), PALE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ALIGN", (0, 0), (-1, -1), "CENTER"), ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#CDD6E2")),
    ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CDD6E2")),
    ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))
story += [
    t,
    Spacer(1, 2 * mm),
    Table([[P("NUEVA SEDE: CANCHA BALÓN FUEGO. La actividad ya no se realizará frente a Makro.", callout)]], colWidths=[175 * mm], style=[
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF3F4")),
        ("BOX", (0, 0), (-1, -1), 0.8, RED),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]),
    Spacer(1, 4 * mm)
]

sections = [
    ("1. Finalidad", [
        "Promover la integración, el compañerismo y la sana competencia entre los participantes, en el marco de las celebraciones por el aniversario de ANIN.",
    ]),
    ("2. Modalidades e inscripción", [
        "Se recibirán inscripciones para <b>fútbol</b> y <b>vóley mixto</b>. Cada equipo deberá registrar un delegado responsable, datos de contacto y la nómina completa de jugadores.",
        "La inscripción implica la aceptación íntegra de estas bases. La organización podrá verificar la identidad de los participantes antes del inicio de cada encuentro.",
    ]),
    ("3. Sistema de competencia", [
        "La programación y las llaves se definirán mediante <b>sorteo</b>, de acuerdo con la cantidad final de equipos inscritos en cada modalidad.",
        "El campeonato se disputará por <b>eliminación directa</b>: el equipo ganador de cada partido continúa a la siguiente fase hasta llegar a la final.",
        "Las semifinales también serán eliminatorias; quienes ganen sus respectivos partidos clasificarán a la final. El ganador de la final será proclamado campeón.",
    ]),
    ("4. Duración de los partidos", [
        "En fútbol, cada encuentro tendrá dos tiempos de <b>15 minutos</b> cada uno, para un total de <b>30 minutos de juego</b>. El descanso entre tiempos será definido por la mesa de control procurando no afectar la programación.",
        "Para vóley mixto, el formato, puntaje y cantidad de sets se comunicarán en la reunión técnica, considerando la cantidad de equipos inscritos y el tiempo disponible.",
    ]),
    ("5. Empates y clasificación", [
        "Si un partido de fútbol termina empatado, la clasificación se resolverá mediante tanda de tres penales por equipo. De persistir el empate, se ejecutarán penales alternados hasta definir un ganador.",
        "No habrá partidos de revancha. Toda decisión de clasificación quedará registrada por la mesa de control.",
    ]),
    ("6. Puntualidad y presentación", [
        "La <b>puntualidad es obligatoria</b>. Cada equipo deberá presentarse completo y acreditado como mínimo <b>15 minutos antes</b> de la hora programada.",
        "Se otorgará una tolerancia máxima de <b>5 minutos</b>. Vencida la tolerancia, el equipo ausente perderá por <i>walkover</i>, salvo causa de fuerza mayor aceptada expresamente por la organización.",
        "Los equipos deberán usar indumentaria deportiva uniforme o, como mínimo, camisetas del mismo color. Si existe similitud de colores, la organización entregará chalecos a uno de los equipos.",
    ]),
    ("7. Conducta y seguridad", [
        "Se exige respeto a rivales, árbitros, mesa de control, organizadores y público. Las agresiones, actos discriminatorios, conducta antideportiva grave o participación en estado de ebriedad ocasionarán la expulsión del participante y podrán determinar la descalificación de su equipo.",
        "Cada participante declara encontrarse en condiciones físicas adecuadas para competir y será responsable de su salud y pertenencias personales. Se recomienda realizar calentamiento previo e hidratación constante.",
    ]),
    ("8. Arbitraje y decisiones", [
        "Las decisiones arbitrales adoptadas durante el juego son definitivas. Los reclamos administrativos deberán ser presentados por el delegado ante la mesa de control, de forma respetuosa, antes del inicio de la siguiente fase.",
        "Los casos no previstos serán resueltos por UDE Arequipa, priorizando la seguridad, el juego limpio y la continuidad del campeonato.",
    ]),
    ("9. Premio", [
        "El equipo campeón recibirá el trofeo del campeonato. La imagen de la copa mostrada en la aplicación es <b>referencial</b> y no representa necesariamente el modelo final a entregar.",
    ]),
]

for heading, paras in sections:
    block = [P(heading, h1)]
    for para in paras:
        block.append(P("• " + para, bullet))
    story.append(KeepTogether(block))

story += [
    Spacer(1, 4 * mm),
    Table([[P("JUEGA LIMPIO · LLEGA TEMPRANO · CELEBREMOS JUNTOS", callout)]], colWidths=[175 * mm], style=[
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF3F4")),
        ("BOX", (0, 0), (-1, -1), 1, RED),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]),
]

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc = NumberedDocTemplate(
    str(OUTPUT), pagesize=A4, rightMargin=16 * mm, leftMargin=16 * mm,
    topMargin=23 * mm, bottomMargin=18 * mm, title="Bases Campeonato Relámpago ANIN 2026",
    author="UDE Arequipa"
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
doc.addPageTemplates([PageTemplate(id="main", frames=frame, onPage=header_footer)])
doc.build(story)
print(OUTPUT)
